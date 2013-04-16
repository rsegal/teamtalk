function Project(nArg) {
	this.name = nArg;
	this.groups = {}; // each project is run by one or more group (expected use case is 1-2)
}