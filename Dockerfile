FROM --platform=linux/amd64 ubuntu:20.04

ENV HUGO_VERSION=0.71.1
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_Linux-64bit.tar.gz" \
    | tar -xz -C /usr/local/bin hugo

WORKDIR /site

EXPOSE 1313

CMD ["hugo", "server", "--bind", "0.0.0.0"]
