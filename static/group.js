function SubGroup(name, parent) {
	self = this;
	self.name = name;
	/*
	A sub group has zero or more parents, keyed by parent.name
	expected use case is 1 parent for most subgroups in a group, e.g. a tree structure
	*/
	self.parents = {};
	if (parent !== "none") self.parents = {parent.name : parent};
	/*
	a sub group has zero or more users, keyed by user.name
	expect great variation in users per group, no "expected use case"
	*/
	self.users = {};
	self.addUser = function(user) {
		self.users[user.name] = user;
		user.groups[self.name] = self;
	}
	self.removeUser = function(user) {}
	self.changeName = function(newName) {}
	self.deleteSubGroup = function() {}



}

function Group(name, firstUser) {
	self = this;
	self.name = nArg;
	self.creator = firstUser;
	/*
	a group has zero or more simultaneous projects, keyed by project.name
	expected use case is < 4 active projects
	*/
	self.projects = {};
	/*
	a group has one or more users
	*/
	self.users = {firstUser.name : firstUser};
	self.subgoups = {};
	self.subgoups.add("Admins", new SubGroup("Admins", "none"));
	self.subgoups["Admins"].addUser(self.users[self.creator.name]);
	self.subgoups.add("General", new SubGroup("General", "Admins"));
	self.subgoups["General"]

	self.addUser = function(user) {}
	self.removeUser = function(user) {}
	self.changeName = function(newName)} {}
	self.removeSubGroup = function(group) {}
	self.deleteGroup = function() {}
}