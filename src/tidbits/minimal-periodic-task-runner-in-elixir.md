---
title: Minimal Periodic Task Runner in Elixir
pubDate: 2025-11-18
description: 'Keeping it simple with GenServer :timeout'
tags: ["elixir"]
---

> **Update:** This post has been updated to include an additional [Shortcomings](#update-november-22-2025---shortcomings) section, but I've left the original post because I think the abuse of `:timeout` is still interesting.

## Background

Recently, I needed a lightweight way to run a periodic job in the background to clean up some expired database records. Precise timing wasn't important, this was the only background work needed in the app, and it needed to self heal if anything went wrong.

Because this was such a trivial task, I didn't want to set up a heavyweight job execution framework like Oban. Additionally, this app was deployed as a single Docker container, so adding the clunkiness of cron jobs to the deploy process did not seem fun to me.

## GenServer Timeouts

One of the cool features of the GenServer module is the `:timeout` message. From [the docs](https://hexdocs.pm/elixir/1.19.3/GenServer.html#module-timeouts):

> The return value of `init/1` or any of the `handle_*` callbacks may include a timeout value in milliseconds;
>
> ...when the specified number of milliseconds have elapsed with no message arriving, `handle_info/2` is called with `:timeout` as the first argument.

This lets us initialize a `GenServer` with a timeout, store it as state, and return it  from both `init/1` and `handle_info/2`.

Now the `GenServer` will receive `:timeout` again after each run, which effectively triggers `handle_info(:timeout, state)` on the configured interval. This setup has the added bonus of preventing overlapping executions.

Here is a full example:

```elixir
defmodule MyApp.ExpireWorker do
  use GenServer

  def start_link(period_in_milliseconds) do
    GenServer.start_link(__MODULE__, period_in_milliseconds, name: __MODULE__)
  end

  def init(period_in_milliseconds) do
    # {:ok, state, timeout()}
    {:ok, period_in_milliseconds, period_in_milliseconds}
  end

  def handle_info(:timeout, period_in_milliseconds) do
    case MyApp.Tokens.purged_expired() do
      {:ok, num_deleted} ->
        IO.inspect("Deleted #{num_deleted} expired tokens")

      {:error, error} ->
        IO.inspect("Error deleting expired tokens: #{inspect(error)}")
    end

    # {:noreply, state, timeout()}
    {:noreply, period_in_milliseconds, period_in_milliseconds}
  end
end
```

## Usage

If you already have a supervisor, simply add it as one of the child processes with a timeout in milliseconds:

```elixir
def start(_type, _args) do
  children = [
    MyApp.Telemetry,
    MyApp.Repo,
    {MyApp.ExpireWorker, 1000 * 60 * 5}, # [!code highlight]
    MyApp.Endpoint
  ]

  opts = [strategy: :one_for_one, name: MyApp.Supervisor]
  Supervisor.start_link(children, opts)
end
```

Otherwise manually start:

```elixir
{:ok, pid} = GenServer.start_link(MyApp.ExpireWorker, 1000 * 60 * 5)
```

## Alternatives

Another option is `:timer.send_interval/2`, but the `:timeout` mechanism keeps everything in a supervised `GenServer` and avoids overlapping executions.

The `:timeout` pattern doesn’t provide the stronger guarantees that a real job scheduler would, so something like [Oban](https://github.com/oban-bg/oban) could be a better fit for tasks that aren't lightweight cleanup tasks.

## Update November 22, 2025 - Shortcomings

It has been pointed out that I missed two very important things:

### 1 - No Extensibility

Abusing the `:timeout` feature means any other message being received by the `GenServer` will prevent the next timeout from firing. This limits how much additional functionality you can add without having to redo this.

### 2 - Process.send_after/4

The idiomatic way of sending a periodic message to a process is using [Process.send_after/4](https://hexdocs.pm/elixir/Process.html#send_after/4). This allows the rest of the `GenServer` to be compatible with receiving other messages.
