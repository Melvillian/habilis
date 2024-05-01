# Kamal Deploy Config

This directory contains all of the deploy and hooks info for our Kamal infra. Currently we use Hetzner as our server provider, and we manage infra deployment with [Kamal](https://kamal-deploy.org/)

## Common Commands

### `kamal env push`

This is an important one to remember, so I'm putting it first. When you write some new code that changes the env variables, that update needs to be proactively pushed to the servers! If you forget this and run `kamal redeploy`, things will not work and may fail in confusing ways. Always run `kamal env push` when you change an environment variable.

### `kamal redeploy`

This will be the primary command you run when interacting with kamal. It will do the following:

- rebuild the docker container for own main app based on your current branch
- push that docker image to our registry
- ssh into the server(s) running that container (behind a traefik load balancer)
- pull the new image
- spin up the new image
- when the new container is healthy, kamal will tell traefik to route to the new container
- kamal will remove the old container

Exactly what you want, nothing you don't. This part I think is fairly straigtforward, though I don't know much about traefik.

### `kamal setup`

If you add a server (due to massive adoption of Habilis), you'll need to run `kamal setup` to make sure it is ready to be managed by kamal. This command basically makes sure docker is present on each of the hosts, then finishes.

### `kamal accessory reboot [name]`

Probably not something you'll run often. But in case redis is on the fritz or you just wanna kick the tires on postgres and see what happens when you turn it off/on again, this is the command to do it. Good to know, but not something I'd expect you or anyone to use regularly.