FROM hexpm/elixir:1.18.0-erlang-26.2.5-debian-bookworm-20240701 AS builder

RUN apt-get update -y && apt-get install -y build-essential git \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV MIX_ENV=prod

RUN mix local.hex --force && mix local.rebar --force

COPY mix.exs mix.lock ./
RUN mix deps.get --only prod
RUN mkdir config
COPY config/config.exs config/prod.exs config/runtime.exs config/
RUN mix deps.compile

COPY priv priv
COPY lib lib

RUN mix compile
RUN mix release

FROM debian:bookworm-slim AS runtime

RUN apt-get update -y && apt-get install -y libstdc++6 openssl libncurses5 locales ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

WORKDIR /app
RUN chown nobody /app

ENV MIX_ENV=prod

COPY --from=builder --chown=nobody:root /app/_build/${MIX_ENV}/rel/remote_pay ./

USER nobody
EXPOSE 4000

CMD ["bin/remote_pay", "start"]
