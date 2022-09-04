---
title: "The Missing Docs on CircleCI (+Shell)"
description: "Tools & Tips to tackle edge cases and advanced scenarios when working with CircleCi"
date: 2022-09-04
type: "post"
draft: false
image: "/images/circleci+shell.png"
categories:
- Tech
- Guide
slug: circleci-shell-guide
tags: 
- CircleCI
- Shell
- Bash
- Data Wrangling
- JSON
---
# The Missing Docs on CircleCI (+ Shell)
Hi there! Many teams are relying on [CircleCI](https://circleci.com) to handle their CI (Continuos Integration) pipelines (I know we do @[Instabug](https://www.instabug.com)). CircleCI is actually very powerful. However, there are many scenarios you expect to be supported yet they (seemingly) are not. You've looked up the docs and the communiy's collective knowledge yet you're faced with either dead ends or some very complex, not-safe solutions.  

CircleCI is actually flexible (in its own way). You often can do (most of) the things you want to do. It's just that you have to do them *the CircleCI way*.

I'll provide here some Tools & Tips that will help You achieve many of the advanced scenarios you'll face.


## Table of Content
1. [Tools](#tools)
    1. [CircleCI CLI](#circle-cli)
    2. [CircleCI Plugin for Intellij-based IDEs](#circle-intellij-plugin)
    3. [ShellCheck](#shellcheck)
    4. [shfmt](#shfmt)
2. [How to ~~cope with depression~~ better approach CircleCI](#circle-tips)
    1. [Dynamic Parameters](#dynamic-parameters)
    2. [Dynamic Parameters (to Commands)](#dynamic-parameters-to-commands)
    3. [Using an Env. variable inside a shell script](#env-var-in-shell)
    4. [Getting “permission denied” when running a script even though it is executable](#shell-executable-permission)
3. [Shell tips and tricks](#shell-tips-and-tricks)
    1. [Json comes into your shell house, how do you say hi?](#json-jq)
    2. [How to do math](#math-bc)
    3. [Fail-early](#fail-early)
    4. [Network request failure](#network-request-fail)
    5. [cURLy output? Use this formula](#curl-silence)


## Tools {#tools}

### CircleCI CLI {#circle-cli}

If you want to validate that your `config.yml` file is syntactically correct _(because that’s only what you’ll get)_ _**before**_ pushing to GitHub and be greeted by a `build error`. Use [CircleCI’s local CLI](https://circleci.com/docs/local-cli "https://circleci.com/docs/local-cli") to static-check your file. it’ll not detect a type error, but it will detect a bad indentation or referencing a `job` name that doesn't exist. You know, everyday errors. *You get used to it*.

Install it then run:

``` shell
circleci config validate
```

Now you’ve made sure you’ll only be bothered by the harder, less obvious errors that were not detected. That’s progress!

### CircleCI Plugin for Intellij-based IDEs {#circle-intellij-plugin}

The title says it all. It basically is a `YAML` checker + some stuff that isn’t at all useful. But overall it will help you with some syntax errors (and false negatives) without manually looking for them. Install [here](https://plugins.jetbrains.com/plugin/13690-circleci "https://plugins.jetbrains.com/plugin/13690-circleci").

### ShellCheck {#shellcheck}

If you’re working with CircleCI, odds are you’re working with the shell to do some hacky whacky skkkriptin'. And to make the process a tad less of a _spray n' pray_, `shellcheck` will static-check your script, give you advice that you really should listen to, and even give you suggestions. It’s like asking grandpa to validate your scripts! You can use it online or install it [here](https://www.shellcheck.net/ "https://www.shellcheck.net/"), and if you’re using an Intellij-based editor/ IDE it’ll automatically be used by the bundled `Shell Script` plugin.

### shfmt {#shfmt}

This is not a bad word, it’s just a bad abbreviation. [shfmt](https://github.com/mvdan/sh "https://github.com/mvdan/sh") is a shell formatter. To make your shell scripts less ugly. [Install on Hombrew](https://formulae.brew.sh/formula/shfmt "https://formulae.brew.sh/formula/shfmt") _(if you're on linux you know where to get your stuff)._  
Did I mention it’ll also be automatically picked and used by the bundled Shell Script plugin on Intellij-based editors/ IDEs? _this generation has it easy_.

----------

## How to ~~cope with depression~~ better approach CircleCI {#circle-tips}

Here I’ll cover some use cases that are known to be really counter-intuitive (to put it nicely) in CircleCI.

### Dynamic Parameters {#dynamic-parameters}

You want to pass a piece of data from a step to another. How to do this in CircleCI?

**The short version**: You can’t.  
**Why?** You can’t pass inputs to `steps`. You can pass them to a `command` but even that won’t work for most cases (see below).

**Workaround:** Your only hope (I mean it, there’s only one practical way so don’t bother) is to store this little value in the Environment Variables and retrieve it later. For example:

``` yml
steps:  
  -  run:  
    name: Post release to GitHub repo 
    command:  |  
     set -e 
     rel_id=$(./scripts/post-internal-release.sh) 
     echo "export REL_ID='$rel_id'" >> $BASH_ENV
```

We’ve stored the release id (`rel_id`) in `$BASH_ENV` and named it `REL_ID`. To access it in another `step`, or a `command`:

``` yml
run:  
  name: Upload mapping files to github 
  command:  |  
  ./scripts/upload_mapping_to_github.sh ${REL_ID}
  ```

And here we retrieve it using the funky dollar sign: `${REL_ID}`.

----------

### Dynamic Parameters (to Commands) {#dynamic-parameters-to-commands}

You want to pass a piece of data to a CircleCI `command`. The catch is that this parameter can be only determined in runtime (Say a script result or network response). How to do this in CircleCI?

**The short version**: You can’t.  
**Why?** Because since CircleCI v2.1 all parameters will be inflated at parse time and not in runtime. Which means that little script result of yours is now just a script. Which means you’ve passed a script invocation as CircleCI dumb parameter. I hope you’re proud of yourself now.

**Workaround:** One of the things CircleCI did so right was to allow passing `steps` as parameters to a CircleCI `command` (think higher-order functions). Using this, instead of passing the script (result) as a parameter, pass the `step` that calls this script as a parameter and it automatically runs in the same context as the command. Which means you can access the created files and the `env` of the job and the command.

Here, an example:

``` yml
post-github-release:  
  description: Post a release to GitHub repo 
  parameters:  
    sdk-builder:  
      type: steps 
      default:  []  
    is-pre-release:  
      type: boolean 
      default:  false  
    company:  
      type: string 
      default: internal
  steps:  
    -  steps: << parameters.sdk-builder >>  
    -  run: ./bla_bla_bla.sh
```

See that? `sdk-builder` is a ~~lambda~~ `step` that gets dynamically invoked based on the caller of this `command`. But the important thing is that `bla_bla_bla.sh` runs in the same context as `sdk-builder`; any file changes, `env` changes are accessible by both.

----------

### Using an Env. variable inside a shell script {#env-var-in-shell}

**The short version**: It’s completely fine, you just might be doing it wrong.

**How?** By using the same magical dollar sign `$` to access anything shell-related, including the contents of the `env`:

``` shell
PR_LINK=$CIRCLE_PULL_REQUEST
```

You see, CircleCI complies with the `POSIX` standard. but the reason you can’t access the `env` is not at all related to CircleCI. It’s because _you sir invoke the script the wrong way._

This is how to properly invoke a shell script:

``` shell
./script_to_run.sh
```

And not:

``` shell
sudo sh script_to_run.sh
```

The latter invokes your script in a new `sh` env. that doesn't have access to the parent env. by default.
In order to do this you have to do 2 things:

1.  Add this line (_shebang_) to the very top of your script: `#!/bin/bash`
    
2.  Update your script permission to be executable: `sudo chmod +x your_script.sh`
    

----------

### Getting “permission denied” when running a script even though it is executable {#shell-executable-permission}

When setting the permission of a script make sure to do this (specifically if it’s an already existing script):

``` shell
sudo chmod +x your_script.sh 
git update-index --chmod=+x your_script.sh
```

When you push, the second line makes sure the script in your remote repo. is also executable.

----------

## Shell tips and tricks {#shell-tips-and-tricks}

### Json comes into your shell house, how do you say hi? {#json-jq}

I know you’ve a couple of `grep`s and `tr`s ready for dealing with people like Json, but let me tell you how to do it _**for good**_: Use [jq](https://stedolan.github.io/jq/ "https://stedolan.github.io/jq/"). It’s tiny, effective, and has all the required syntax to wrangle the living bits out of this so-called json man. You can toy with it [online](https://jqplay.org/ "https://jqplay.org/") till you find the perfect filter and apply it just like with Instagram. For example, this is how I filter 7k+ entries in a json array to find a certain object:

``` shell
job=$(jq '.items[] | select(.name == "job-requires-approval")'  <<<  "{items: [...]}")  
approver_id=$(jq '.approved_by'  <<<  "$job")
```

----------

### How to do math {#math-bc}

Turns out math isn’t easy after all. At least for the shell. in order to do proper arithmetic ops in the shell you have to use a custom `GNU` language for it: [bc (basic calculator)](https://en.wikipedia.org/wiki/Bc_(programming_language) "https://en.wikipedia.org/wiki/Bc_(programming_language)"). In CircleCI, there’s a high chance that you’re running on a `debian-based` machine. So installing `bc` is as easy as:

``` shell
sudo  apt  install  bc
```

To use it, you can think of it as a simple C-like language:

``` shell
two=$(echo  "1 + 1"  |  bc)
```

If you’re dealing with floating-point numbers add the `-l` flag:

``` shell
variance=$(echo  "$delta - $tolerable"|bc -l)
```

To round a number, divide by `1` (bear with me):

``` shell
echo  "1.7/1"  |  bc  # prints 1
```

----------

### Fail-early {#fail-early}

A wise man once said

> It’s better to know that you’re failing than knowing that you’ve already failed.

Let’s pretend that actually happened and put it into context: You have a `run step` or a script that runs multiple commands. Now when one of these commands fail, it doesn’t mean the script or the step will stop running the rest (by default). And this is bad.  
  
To change this in a script you add this before your commands:

``` shell
set -e # this bad boy 
echo  "bla bla bla"  
# some failing commands here....  
echo  "pffft"  # this won't be printed if a command fails before this line
```

To change this in a `run step` is not so different:

``` yml
run:  
  name: Post release to GitHub repo 
    command: |  
    set -e # that's our boy
    rel_id=$(./scripts/post-internal-release.sh)
    echo "export REL_ID='$rel_id'" >> $BASH_ENV
```

----------

### Network request failure {#network-request-fail}

Say you’re `curl`ing some endpoint and you want to fail the script/ `job` when the response code is not a major success. You can check if it’s `> 200` and `< 300` or all sorts of tricks but there’s actually a native way to do it with `curl`: The fail flag `-f` this bad boy will fail the with an exit code that is guaranteed `> 0` when your response code is not a success:

``` shell
curl -f -X GET "https://circleci.com/api/v2/workflow/$WORKFLOW_ID/job" -u "$CIRCLE_TOKEN":
```

Combine this with the former tip and you have fail-early combination that’ll make sure you never fail twice _(at least in the same context)_.

----------

### cURLy output? Use this formula {#curl-silence}

You have a script that does something and returns a value when it finishes:

``` shell
curl -f -X GET "https://circleci.com/api/v2/workflow/$WORKFLOW_ID/job" -u "$CIRCLE_TOKEN":  
echo  "result"
```

The problem here is that curl prints stuff too. so `"result"` won’t be the only output of your script. Luckily, you can tell `curl` to shut up (in a nice way) by using the `-s` flag:

``` shell
curl -s -f -X GET "https://circleci.com/api/v2/workflow/$WORKFLOW_ID/job" -u "$CIRCLE_TOKEN":  
echo  "result"
```

----------

Have a comment? Please post it right below.