---
title: ExUnit log_level macro
pubDate: 2025-06-28
description: 'Configure the log level per test'
tags: ["elixir"]
---

Recently I was working on an Elixir code path that is expected to emit specific `info` logs for short term auditing purposes. It was nearly impossible to test because my test environment's log level is set to `:warning` and above. While this is a fairly sane default to prevent noisy log output on errors, I needed a way to temporarily change the log level for a couple specific tests.

# Example of the problem

Here is a self contained fabricated example that leverages `with_log/2` to capture the log stream along with the result. The assertion at line 10 will fail due to the info log being dropped.

```elixir
defmodule MyApp.SomeTest do
  test "something with info logs" do
    {result, log} =
      with_log(fn ->
        Logger.info("log msg")
        2 + 2
      end)

    assert result == 4
    assert log =~ "log msg" # 💥💥💥 [!code highlight]
  end
end
```

# Macros to the rescue

This felt like the perfect use case for macros, so I defined a `log_level` macro to wrap test blocks that need alternative `Logger` level configuration.

The macro does the following:

1. Wraps the block in a `describe` mentioning how it's changing the log level
2. Creates a `setup` block that remembers the original log level
3. Sets the new temporary log level
4. Sets up an `on_exit` callback to restore the original log level after the test runs
5. Calls the original test block

```elixir
defmodule MyApp.Case do
  # Add this macro to your base Case module
  defmacro log_level(level, description \\ nil, do: block) do
    description =
      if is_binary(description),
        do: description,
        else: "with log level #{level}"

    quote do
      describe unquote(description) do
        setup do
          old_level = Logger.level()
          Logger.configure(level: unquote(level))
          on_exit(fn -> Logger.configure(level: old_level) end)
        end

        unquote(block)
      end
    end
  end
end
```

# Example usage

Once you've added the macro to your application Case module, you can wrap a test like this:

```elixir
defmodule MyApp.SomeTest do
  log_level :info do # [!code highlight]
    test "something with info logs" do
      {result, log} =
        with_log(fn ->
          Logger.info("log msg")
          2 + 2
        end)
      assert result == 4
      assert log =~ "log msg"
    end
  end # [!code highlight]
end
```

# Limitation

This solution does come with a limitation in that it wraps the tests in a `describe` block. `ExUnit` [does not allow nesting of](https://github.com/elixir-lang/elixir/blob/237263c446bbe15c00984aa926592179bfd9e772/lib/ex_unit/lib/ex_unit/case.ex#L536-L538) `describe` calls, so this macro will need to replace any existing `describe` you have. We slightly make up for this limitation by allowing you to override the message passed to `describe` as the second argument.

This is just the way I solved the problem for myself (as a novice Elixir dev). There are probably better or cleaner ways to handle this, so feel free to reach out with your ideas.
