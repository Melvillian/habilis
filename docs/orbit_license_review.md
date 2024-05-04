# Notes on Orbit's Licenses

Orbit uses two distinct licenses that cover different parts of the code. We will start with the simple license, which covers most of the *packages* in the repo. And then we'll cover the more involved license.

# Most of the code is permissively licensed

The main license in the repo states the following:

> All sources in this repository, except those in the subtrees packages/app and packages/backend, and all compiled distribution binaries, are licensed under Apache 2.0 (see LICENSE.Apache-2.0 for text).

Reading the Apache 2.0 license (and recognizing IANAL), this looks like we can, for the purposes we care about (e.g. packaging/modifying the software, redistributing, selling a saas subscription as part of a non-profit) do everything we want. Here's the relevant sections of the license that lead me to this conclusion:

> Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

> You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:
> 
> (a) You must give any other recipients of the Work or Derivative Works a copy of this License; and
> (b) You must cause any modified files to carry prominent notices stating that You changed the files; and
> (c) You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and
> (d) If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file...

Overall, I'm left feeling like we are in good shape to read, use, import, modify, etc the code licensed under this license as part of non-profit or for-profit work, granted we attribute the materials we use.

I haven't looked closely at the code (perhaps we should do that together), but this license applies to the following packages that seem *plausibly* interesting:

- `packages/anki-import`
- `packages/api-client`
- `packages/api`
- `packages/core`
- `packages/ingester`
- `packages/sync`
- `packages/web-component`

# Some of the code has a more aggressive*/restrictive license

*\*for some definition of aggressive*

Two of the packages `packages/app` and `packages/backend` have special licensing rules. These packages give you a choice of license:

- AGPL 3.0+
- BUSL 1.1

tl;dr: these place meaningful restrictions on using these source code files for commercial use. It's not a ban, but it is restrictive.

## Option 1: AGPL 3.0+

We can *choose* to use the `app`/`backend` code with AGPL 3.0+. I read most of the AGPL license, enough to understand the teeth of it I think, but IANAL. Probably good to run this analysis through ChatGPT if we have specific other questions.

**Here's the tl;dr: any code we write that uses the `packages/app` code or `packages/backend` code automatically becomes licensed under AGPL 3.0+, meaning the source has to be made available.**

### AGPL 3.0+ extended commentary/parts of interest

The license was pretty helpful in laying out its goals. Here's are some sections worth reading:

> The licenses for most software and other practical works are designed to take away your freedom to share and change the works.  By contrast, our General Public Licenses are intended to guarantee your freedom to share and change all versions of a program--to make sure it remains free software for all its users.
> 
> When we speak of free software, we are referring to freedom, not price.  Our General Public Licenses are designed to make sure that you have the freedom to distribute copies of free software (and charge for them if you wish), that you receive source code or can get it if you want it, that you can change the software or use pieces of it in new free programs, and that you know you can do these things.

The license then goes on to lay out concerns prompting certain restrictions/obligations on the part of users of the software. I found this to be helpful background:

> A secondary benefit of defending all users' freedom is that improvements made in alternate versions of the program, if they receive widespread use, become available for other developers to incorporate.  Many developers of free software are heartened and encouraged by the resulting cooperation.  However, in the case of software used on network servers, this result may fail to come about. The GNU General Public License permits making a modified version and letting the public access it on a server without ever releasing its source code to the public.

So, people are concerned that someone will start a saas company with this code, make a bunch of improvements, deploy them on their servers, and never share the improvements. Fair.

The license then lays out how it plans to address this concern: users of the software that run the software on networked servers have to provide the source code they run to people who request it.

> The GNU Affero General Public License is designed specifically to
ensure that, in such cases, the modified source code becomes available to the community.  It requires the operator of a network server to provide the source code of the modified version running there to the users of that server.  Therefore, public use of a modified version, on a publicly accessible server, gives the public access to the source code of the modified version.

I'll note here that this is reminiscent of a post on HN recently, where someone made Truth Social release their source code by requesting it. Evidently, Truth Social is a skin on top of Mastodon, which uses this license or a similar one. Truth Social complied with the request, and it was no big deal. Evidently they've published it a few times before. Anyways, a little anecdote there, also highlighting that commercial entities use software with similar licenses.

So, this is one major idea around using the code in these particular packages: you can't take the code, re-skin it or extend it or whatever, and launch a saas company with a bunch of copyright that prevents other people from using your code. Anything we build on top of these packages will be source-available to the broader community.

### Seemingly "the big clause" in AGPL 3.0+

The "big" clause seems to be Section 10, which makes AGPL 3.0+ a viral license that supercedes other licenses:

> 10. Automatic Licensing of Downstream Recipients.
> 
> Each time you convey a covered work, the recipient automatically
> receives a license from the original licensors, to run, modify and propagate that work, subject to this License.  You are not responsible for enforcing compliance by third parties with this License.

And then a little later in Section 10 (skipping a section that is mostly wordy nonsense):

> You may not impose any further restrictions on the exercise of the rights granted or affirmed under this License.  For example, you may not impose a license fee, royalty, or other charge for exercise of rights granted under this License, and you may not initiate litigation (including a cross-claim or counterclaim in a lawsuit) alleging that any patent claim is infringed by making, using, selling, offering for sale, or importing the Program or any portion of it.

This section, guaranteeing that derivative works must use AGPL 3.0+, has significant implications for extending/selling this software.

Other sections offer restrictions/obligations in a similar vein. For example, if you obtain a patent license and use that license plus AGPL 3.0 code to make some product, you're gonna have a bad time. The AGPL 3.0 requires that you either stop using the code or make the patent license available to downstream consumers of your product. There's also anti-DMCA stuff, to prevent people from using this software in code that relies on DMCA to make money.

All told, AGPL 3.0+ is very protective of free software. Overall, a good thing for many programs.

## What about that other license? BUSL 1.1?

If we wanted to use `packages/app` or `packages/backend` code in our code in some capacity, we can use it under AGPL 3.0 *or* this other license: BUSL 1.1

The tl;dr with this license is that we have to get explicit permission from the license holder to use the code commercially *or* wait until Dec 2025, at which point the code will become available under Apache 2.0 (the first license mentioned at the very very top, means you can do mostly whatever you want with it).

# Final Thoughts

I think we'd want to be careful using things from `packages/app` and `packages/backend`. While we have talked about doing non-profit stuff and making things open source, the viral nature of AGPL is particularly restrictive and gives me pause.

Other than that, seems like we should feel free to look at, be inspired by, use, change, etc the code in orbit.
