# sysarch

I want to build big architecture diagrams for complex software.

I want an editor to create diagrams in a flexible way.

I evaluated my manual process in a drawing app on iPad and came up with the following idea:

You create blocks representing modules. Good software is composed out of modules. To these blocks' edges you can add an arbitrary number of ports. Ports can be incoming or outgoing, they can have arbitrary, user-defined types, and a protocol (HTTP, gRPC, etc).

You can then establish connections between ports.

There are some built in blocks that one might need, such as conditional diamond for example.

Furthermore, you can zoom into individual modules. Which are also systems. So you're again on the canvas but on another level and you're already given the inputs and outputs of this module. And you can also create sub modules and connections on this level. This is how you can zoom in pretty much indefinitely.

So it's up to you to leave certain systems - for example the self explanatory ones - as black boxes and to model deliberately many levels of the others.

To summarize:

- Systems are composed out of modules
- You can zoom into every module and see again a system which you can model as well
- You can label many things such as connections, ports, edges, modules etc.
