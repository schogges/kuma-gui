resolve/bin: PACKAGE?=$(BIN)
resolve/bin:
	@cd $(KUMAHQ_CONFIG) && \
		node -e \
			"const p = require.resolve('$(PACKAGE)/package.json');const { dirname, resolve } = require('path'); const json = require(p); console.log(resolve(dirname(p), json.bin['$(BIN)'] ?? json.bin))"
.PHONY: check/node
check/node: NPM_VERSION:=$(shell cat $(NPM_WORKSPACE_ROOT)/package.json | jq -r '.engines.npm')
check/node: NODE_VERSION:=v$(shell head -n1 $(NPM_WORKSPACE_ROOT)/.nvmrc)
check/node:
	@node -v | grep $(NODE_VERSION) &> /dev/null || ( \
		printf "\033[91m%-30s\033[0m %s\n" \
			"Make sure node-$(NODE_VERSION) is installed!" && \
		echo "For installing node (we recommend with nvm) please see:" ; \
		echo "https://nodejs.org/en/download" ; \
		exit 1; \
	)
	@if npm ls -g "npm@$(NPM_VERSION)" | grep "empty" > /dev/null; then \
		echo "Make sure npm@$(NPM_VERSION) is installed. Try npm install -g npm@$(NPM_VERSION)"; \
		exit 1; \
	fi

.PHONY: .lint
.lint: .lint/js .lint/ts .lint/css .lint/lock .lint/gherkin

.PHONY: .lint/script
.lint/script: .lint/js .lint/ts

.PHONY: .lint/js
.lint/js: ESLINT ?= $(shell $(MAKE) resolve/bin BIN=eslint)
.lint/js:
	@$(ESLINT) \
		--cache \
		$(if $(CI),,--fix) \
		.

.PHONY: .lint/ts
.lint/ts: TSC ?= $(shell $(MAKE) resolve/bin BIN=vue-tsc)
.lint/ts:
	@$(TSC) \
		--noEmit

.PHONY: .lint/css
.lint/css: STYLELINT ?= $(shell $(MAKE) resolve/bin BIN=stylelint)
.lint/css:
	@$(STYLELINT) \
		$(if $(CI),,--fix) --allow-empty-input \
		./src/**/*.{css,scss,vue}

.PHONY: lint/gherkin
.lint/gherkin: GHERKIN_UTILS ?= $(shell $(MAKE) resolve/bin BIN=@cucumber/gherkin-utils)
.lint/gherkin:
	@find ./features \
		-name '*.feature' \
		-exec $(GHERKIN_UTILS) format '{}' +

.PHONY: lint/lock
.lint/lock: LOCKFILE_LINT ?= $(shell $(MAKE) resolve/bin BIN=lockfile-lint)
.lint/lock:
	@$(LOCKFILE_LINT) \
		--path package-lock.json \
		--allowed-hosts npm \
		--validate-https
