# :classical_building: [22120](https://github.com/c9fe/22120) ![npm downloads](https://img.shields.io/npm/dt/archivist1?label=npm%20downloads) ![binary downloads](https://img.shields.io/github/downloads/c9fe/22120/total?label=binary%20downloads) [![latest package](https://img.shields.io/github/v/release/c9fe/22120?label=latest%20release)](https://github.com/c9fe/22120/releases)

[![visitors+++](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fc9fe%2F22120&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=%28today%2Ftotal%29%20visitors%2B%2B%2B%20since%20Oct%2027%202020&edge_flat=false)](https://hits.seeyoufarm.com)

:classical_building: - An archivist browser controller that caches everything you browse, a library server with full text search to serve your archive. 

**News - new binaries** 

----------------
- [Overview](#classical_building-22120---)
  * [License](#license)
  * [About](#about)
  * [Get 22120](#get-22120)
  * [Using](#using)
    + [Pick save mode or serve mode](#pick-save-mode-or-serve-mode)
    + [Exploring your 22120 archive](#exploring-your-22120-archive)
  * [Format](#format)
  * [Why not WARC (or another format like MHTML) ?](#why-not-warc-or-another-format-like-mhtml-)
  * [How it works](#how-it-works)
  * [FAQ](#faq)
    + [Can I use this with a browser that's not Chrome-based?](#can-i-use-this-with-a-browser-that-s-not-chrome-based)
    + [How does this interact with Ad blockers?](#how-does-this-interact-with-ad-blockers)
    + [How secure is running chrome with remote debugging port open?](#how-secure-is-running-chrome-with-remote-debugging-port-open)
    + [Is this free?](#is-this-free)
    + [What's the roadmap?](#what-s-the-roadmap)
    + [What about streaming content?](#what-about-streaming-content)
    + [Can I black list domains to not archive them?](#can-i-black-list-domains-to-not-archive-them)
    + [Is there a DEBUG mode for troubleshooting?](#is-there-a-debug-mode-for-troubleshooting)
    + [Can I change the archive path?](#can-i-change-the-archive-path)
    + [Can I change this other thing?](#can-i-change-this-other-thing)

------------------

## License 

Copyright (c) 2018, 2020, Dosyago and/or its affiliates. All rights reserved.

This is a release of 22120, a web archiver.

License information can be found in the LICENSE file.

This software is dual-licensed. For information about commercial licensing, see [Dosyago Commercial License for OEMs, ISVs and VARs](https://github.com/dosyago/dual-licensing).

## About

**This project literally makes your web browsing available COMPLETELY OFFLINE.** Your browser does not even know the difference. It's literally that amazing. Yes. 

Save your browsing, then switch off the net and go to `http://localhost:22120` and switch mode to **serve** then browse what you browsed before. It all still works.

**warning: if you have Chrome open, it will close it automatically when you open 22120, and relaunch it. You may lose any unsaved work.**

## Get 22120

3 ways to get it:

1. Get binary from the [releases page.](https://github.com/c9fe/22120/releases), or
2. Run with npx: `npx archivist1`, or 
3. Clone this repo and run as a Node.JS app: `npm i && npm start` 

Also, coming soon is a Chrome Extension.

## Using

### Pick save mode or serve mode

Go to http://localhost:22120 in your browser, 
and follow the instructions. 

### Exploring your 22120 archive

Archive will be located in `$your_user_home_directory/22120-arc/public/library`

But it's not public, don't worry!

## Format

The archive format is:

`22120-arc/public/library/<resource-origin>/<path-hash>.json`

Inside the JSON file, is a JSON object with headers, response code, key and a base 64 encoded response body.

## Why not WARC (or another format like MHTML) ?

**The case for the 22120 format.**

Other formats save translations of the resources you archive. They create modifications, such as altering the internal structure of the HTML, changing hyperlinks and URLs into "flat" embedded data URIs, and require other "hacks* in order to save a "perceptually similar" copy of the archived resource.

22120 throws all that out, and calls rubbish on it. 22120 saves a *verbatim* **high-fidelity** copy of the resources your archive. It does not alter their internal structure in any way. Instead it records each resource in its own metadata file.

**Why?**

At 22120, we believe in the resources and in verbatim copies. We don't annoint ourselves as all knowing enough to modify the resource source of truth before we archive it, just so it can "fit the format* we choose. We don't believe we should be modifying or altering resources we archive. We belive we should save them exactly as they were presented. We believe the format should fit (or at least accommodate, and be suited to) the resource, not the other way around. We don't believe in conflating **metadata** with **content**; so we separate them. We believe separating metadata and content, and keeping the content pure and altered throughout the archiving process is not only the right thing to do, it simplifies every part of the audit trail, because we know that the modifications between archived copies of a resource of due to changes to the resources themselves, not artefacts of the format or archiving process.

Both WARC and MHTML require mutilatious modifications of the resources so that the resources can be "forced to fit" the format. At 22120, we believe this is not required (and in any case should never be performed). We see it as akin to lopping off the arms of a Roman statue in order to fit it into a presentation and security display box. How ridiculous! The web may be a more "pliable" medium but that does not mean we should treat it without respect for its inherent content. 

**Why is changing the internal structure of resources so bad?**

In our view, the internal structure of the resource as presented, *is the canon*. Internal structure is not just substitutable "presentation" - no, in fact it encodes vital semantic information such as hyperlink relationships, source choices, and the "strokes" of the resource author as they create their content, even if it's mediated through a web server or web framework. 

**Why else is 22120 the obvious and natural choice?**

22120 also archives resources exactly as they are sent to the browser. It runs connected to a browser, and so is able to access the full-scope of resources (with, currently, the exception of video, audio and websockets, for now) in their highest fidelity, without modification, that the browser receives and is able to archive them in the exact format presented to the user. Many resources undergo presentational and processing changes before they are presented to the user. This is the ubiquitous, "web app", where client-side scripting enabled by JavaScript, creates resources and resource views on the fly. These sorts of "hyper resources" or "realtime" or "client side" resources, prevalent in SPAs, are not able to be archived, at least not utilizing the normal archive flow, within traditional `wget`-based archiving tools. 

In short, the web is an *online* medium, and it should be archived and presented in the same fashion. 22120 archives content exactly as it is received and presented by a browser, and it also replays that content exactly as if the resource were being taken from online. Yes, it requires a browser for this exercise, but that browser need not be connected to the internet. It is only natural that viewing a web resource requires the web browser. And because of 22120 the browser doesn't know the difference! Resources presented to the browser form a remote web site, and resources given to the browser by 22120, are seen by the browser as ***exactly the same.*** This ensures that the people viewing the archive are also not let down and are given the change to have the exact same experience as if they were viewing the resource online. 

## How it works

Uses DevTools protocol to intercept all requests, and caches responses against a key made of (METHOD and URL) onto disk. It also maintains an in memory set of keys so it knows what it has on disk. 

## FAQ

### Can I use this with a browser that's not Chrome-based? 

No.

### How does this interact with Ad blockers?

Interacts just fine. The things ad blockers stop will not be archived.

### How secure is running chrome with remote debugging port open?

Seems pretty secure. It's not exposed to the public internet, and pages you load that tried to use it cannot use the protocol for anything (except to open a new tab, which they can do anyway). 

### Is this free?

Yes this is totally free to download and use. It's also open source so do what you want with it.

### What's the roadmap?

- Full text search 
- Library server to serve archive publicly.
- Distributed p2p web browser on IPFS

### What about streaming content?

The following are probably hard (and I haven't thought much about):

- Streaming content (audio, video)
- "Impure" request response pairs (such as if you call GET /endpoint 1 time you get "A", if you call it a second time you get "AA", and other examples like this).
- WebSockets (how to capture and replay that faithfully?)

Probably some way to do this tho.

### Can I black list domains to not archive them?

Yes! Put any domains into `$HOME/22120-arc/no.json`, eg:

```json
[
  "*.google.com",
  "*.cnn.co?"
]
```

Will not cache any resource with a host matching those. Wildcards: 

- `*` (0 or more anything) and 
- `?` (0 or 1 anything) 

### Is there a DEBUG mode for troubleshooting?

Yes, just make sure you set an environment variable called `DEBUG_22120` to anything non empty.

So for example in posix systems:

```bash
export DEBUG_22120=True
```

### Can I change the archive path?

Yes, there's a control for changing the archive path in the control page: http://localhost:22120

### Can I change this other thing?

There's a few command line arguments. You'll see the format printed as the first printed line when you start the program.

For other things you can examine the source code. 


