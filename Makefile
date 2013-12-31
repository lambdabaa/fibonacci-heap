.PHONY: default
default: lint test

.PHONY: lint
lint:
	gjslint --recurse . \
		--disable "217,220" \
		--exclude_directories "node_modules"

.PHONY: test
test:
	./node_modules/.bin/mocha
