/*function SubGroup(name, parent) {
	self = this;
	self.name = name; */
	/*
	A sub group has zero or more parents, keyed by parent.name
	expected use case is 1 parent for most subgroups in a group, e.g. a tree structure
	*/
/*	self.parents = {};
	if (parent !== "none") self.parents = {parent.name : parent}; */
	/*
	a sub group has zero or more users, keyed by user.name
	expect great variation in users per group, no "expected use case"
	*/
/*	self.users = {};
	self.addUser = function(user) {
		self.users[user.name] = user;
		user.groups[self.name] = self;
	}
	self.removeUser = function(user) {}
	self.changeName = function(newName) {}
	self.deleteSubGroup = function() {}



}*/
function Group(name, firstUser, organization) {
    self = this;
    self.name = name;
    self.creator = firstUser;
    self.organization = organization;
    self.parents = {}
    self.children = {};
    self.conversations = {};
    self.users = {};

/*    self.changeName = function(newName) {

    } */
    
    self.addUser = function(user) {
	if (! self.users[user.name]) {
	    self.users[user.name] = user;
	    self.users[user.name].addGroup(self);
	}
    }
    self.removeUser = function(user) {
	
    }
    self.addParent = function(group) {
	if (! self.parents[group.name]) {
	    self.parents[group.name] = group;
	    self.parents[group.name].addChild(self);
	}
    }
    self.removeParent = function(group) {
	
    }
    self.addChild = function(group) {
	if (! self.children[group.name]) {
	    self.children[group.name] = group;
	    self.children[group.name].addParent(self);
	}
    }
    self.removeChild = function(group) {
	
    }
    self.addConversation = function(conversation) {
	if (! self.conversations[conversation.name]) {
	    self.conversations[conversation.name] = conversation;
	    self.conversations[conversation.name].addToGroup(self);
	}
    }
    self.removeConversation = function(conversation) {
	
    }
    self.deleteGroup = function() {
	
    }
    
    /*
      a group has zero or more simultaneous projects, keyed by project.name
      expected use case is < 4 active projects
    */
    /*
      a group has one or more users
    */
    self.addUser(firstUser);//{firstUser.name : firstUser};

/*    
    self.subgoups.add("Admins", new SubGroup("Admins", "none"));
    self.subgoups["Admins"].addUser(self.users[self.creator.name]);
    self.subgoups.add("General", new SubGroup("General", "Admins"));
    self.subgoups["General"] */
}