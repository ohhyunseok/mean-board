// User.js

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	userid: {type: String, required:[true, "UserID is required!"], unique:true},
	password: {type: String , required: [true, "Password is required!"]},
	username: {type: String, required: [true, "Name is required!"]},
	email: {type: String},
	registedate: {type: Date, default: Date.now}
}, {
	toObject: {virtuals: true}
});

// virtuals
userSchema.virtual('passwordConfirmation')
.get(function() { return this._passwordConfirmation; })
.set(function(value) { this._passwordConfirmation = value; });

userSchema.virtual('originalPassword')
.get(function() { return this._originalPassword; })
.set(function(value) { this._originalPassword = value; });

userSchema.virtual('currentPassword')
.get(function() { return this._currentPassword; })
.set(function(value) { this._currentPassword = value; });

userSchema.virtual('newPassword')
.get(function() { return this._newPassword; })
.set(function(value) { this._newPassword = value; });

// password validation
userSchema.path('password').validate(function(v) {
	var user = this;

	if (user.isNew) {
		if (!user.passwordConfirmation) {
			user.invalidate('passwordConfirmation', 'Password Confirmation is required!');
		}		
		if (user.password !== user.passwordConfirmation) {
			user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
		}
	}

	if (!user.isNew) {
		if (!user.currentPassword) {
			user.invalidate('currentPassword', 'Current Password is required!');
		}
		if (user.currentPassword && user.currentPassword != user.originalPassword) {
			user.invalidate('currentPassword', 'Current Password is invalid!');
		}
		if (user.newPassword !== user.passwordConfirmation) {
			user.invalidate('passwordConfirmation', 'Password Confirmation does not matchec!');
		}
	}
});


var User = mongoose.model('user', userSchema);

module.exports = User;