---
title: ExUnit log_level macro
pubDate: 2025-06-28
description: 'Configure the log level per test'
tags: ["elixir"]
---

Sometimes when running tests you want to be able to test some of the log output. For good reason, `ExUnit` disables logging while running tests in order to reduce noise in the output.

```elixir
defmodule MyApp.Case do
  # Add this macro to your base Case module
  defmacro log_level(level, description \\ nil, do: block) do
    description =
      if is_binary(description), do: description, else: "with log level #{level}"

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
