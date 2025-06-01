# Global Variables n8n Node

> Inspired by `n8n-nodes-globals`
>
> https://github.com/umanamente/n8n-nodes-globals


![](/screenshots/workflow-canvas.png)

# Install `n8n-nodes-global-variables`

> Requires self-hosted n8n

![](/screenshots/install.png)

# How it works

## 1. Create a `Global Variables` credential

> Note: you can have as many of these as you want to organize your variables.

![](/screenshots/search-credential.png)

## 2. Add some variables with names and values

<!--

const BOOL_COUNT = 5
const NUMBER_COUNT = 5
const JSON_COUNT = 10
const SECRET_COUNT = 10
const STRING_COUNT = 20

-->

> By default, each `Global Variables` credential has the following:
>
> - `5` boolean variables
> - `5` number variables
> - `10` JSON variables
> - `10` secret variables (_password fields so the value is hidden_)
> - `20` string variables
>
> ### Why don't we dynamically add these?
> 
> Because n8n does not support dynamic fields in credentials, e.g. the `fixedCollection` type.

![](/screenshots/cropped-booleans.png)

![](/screenshots/json.png)

![](/screenshots/text.png)

## 3. Add a `Global Variables` node in your workflow

> Choose the credential you created in step 1.

![](/screenshots/search-nodes.png)

![](/screenshots/workflow-canvas.png)

![](/screenshots/node-choode-credential.png)

![](/screenshots/node-all-variables-in-one-key.png)

## That's it!

Wherever the node is used, its variables will be available in the workflow after the node is executed in `$json`.

![](/screenshots/one-key-table.png)

### `$json.vars.X`

If you choose `Put All Variables in One Key` in the node options, all variables will be available under the `$json.<the name you chose>` key.

![](/screenshots/one-key-table.png)

![](/screenshots/one-key-json.png)

### `$json.X`

If you disable `Put All Variables in One Key` in the node options, each variable will be available under its own key in `$json`.

![](/screenshots/not-one-key-table.png)

![](/screenshots/not-one-key-json.png)

## Does not overwrite existing variables

If you have existing variables in your workflow, the `Global Variables` node will not overwrite them.

It will only add the variables that are defined in the credential.

![](/screenshots/workflow-canvas-with-edit-fields.png)

![](/screenshots/show-existing-value.png)

# Attribution

This node is inspired by the `n8n-nodes-globals` node by [Umanamente](https://github.com/umanamente).
>
> https://github.com/umanamente/n8n-nodes-globals
>
> License MIT
