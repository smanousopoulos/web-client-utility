{
	"locale": {
		"en-GB":"English",
		"el":"Greek",
		"es":"Spanish",
		"de":"German"
	},
	"LoginForm": {
		"title": "Sign in to DAIAD@Utility",
		"password": {
			"reset": "Forgot password?"
		},
		"login": {
			"failure": "Authentication has failed. Please try again."
		},
		"button": {
			"signin": "Sign in",
			"signout": "Sign out"
		},
		"placehoder": {
			"username":"Email",
			"password":"Password"
		}
	},
  "PasswordResetForm": {
    "title": "Password Reset",
    "placehoder": {
      "password1": "Enter password",
      "password2": "Re-enter password"
    },
    "button": {
      "reset": "Reset"
    },
    "message": {
      "success" : "Your password has been successfully reset. Click to return to the login page."
    }
  },
	"Section": {
      "Dashboard": "Dashboard",
      "Map": "Map",
	    "Analytics-Group": "Analytics",
	    "Analytics": {
        "Fav": "Favorites",
        "BasicReports": "Reports",
        "ReportPanel": "Charts",
        "Maps": "Maps"
      },
      "Forecasting": "Forecasting",
	    "ModeManagement": "Mode Management",
	    "Users": "Users",
	    "Groups": "Groups",
	    "Messages": "Messages",
	    "Settings": "Settings",
      "Trials": {
        "Group": "Trial Management",
        "Overview": "Overview",
        "PilotReports": "Pilot Reports",
        "System": "System Reports"
      },
      "ManageAlerts": {
        "Engagement": "Engagement",
        "Messages": "Messages",
        "Announcements": "Announcements"
      },
	    "Scheduler": "Job Management",
	    "Consumers": "Consumers",
      "Support" : {
        "Group": "Support",
        "Logging": "Logs",
        "Data": "Data Management",
        "Development": "Development",
        "DataExport": "Data Export"
      },
      "Savings": "Savings Potential",
      "Budgets": "Budgets"
	},
  "Page": {
    "PasswordReset":"Reset Password"
  },
	"Settings" : {
    "User" : "User Preferences", 
		"System" : "System Configuration"
	},
  "UserSettings": {
    "Title": "User Profile",
    "Username": "Username",
    "Firstname": "First name",
    "Lastname": "Last name",
    "Address": "Address",
    "Zip": "Postal code",
    "Country": "Country",
    "CountryPlaceholder": "Select country",
    "TimezonePlaceholder": "Select timezone",
    "Timezone": "Timezone",
    "Locale": "Language",
    "Submit" : "Update"
  },
	"Group" : {
    "FavouriteGroupInfo" : "Favourite Group Info",
    "Name" : "Name",
    "Description" : "Description",
    "CreatedOn" : "CreatedOn",
    "Size" : "Size",
    "Country" : "Country",
    "Members" : "Members"
	},
	"Table" : {
		"Group" : {
			"id": "Id",
			"name": "Name",
			"size": "# of Members",
			"createdOn": "Updated On"
		},
		"User" : {
			"Users": "Users",
			"id": "Id",
			"active": "active",
			"name": "Name",
		    "email": "E-mail",
			"group": "Group",
			"currentMode": "Current Mode",
			"viewInfoOnAmphiro": "b1",
			"viewInfoOnMobile": "Mobile",
			"viewInfoOnWeb": "Web",
			"allowSocial": "Social",
			"deactivateUser": "Deactivate User",
			"searchUsers": "Search users..."
		},
		"Alert": {
			"text" :"Description",
			"createdOn": "Creation Date",
			"acknowledged" : "Is Acknowledged"
		},
		"Save": "Save Changes"
	},
	"AddUserForm" : {
	  "PanelTitle" : "Add new user",
	  "MandatoryFields" : "Mandatory fields",
	  "FirstName" : {
	    "label" : "First Name",
	    "placeholder" : "Please enter First Name."
	  },
	  "LastName" : {
      "label" : "Last Name",
      "placeholder" : "Please enter Last Name."
    },
    "E-mail" : {
      "label" : "E-mail",
      "placeholder" : "Please enter E-mail."
    },
    "Gender" : {
      "label" : "Gender",
      "values" : {
        "Male" : "Male",
        "Female" : "Female"
      }
    },
    "Address" : {
      "label" : "Address",
      "placeholder" : "Please enter Address."
    },
    "Utility" : {
      "label" : "Utility"
    },
    "PostalCode" : {
      "label" : "Postal Code",
      "placeholder" : "Please enter Postal Code."
    }
	},
  "Buttons" : {
    "Cancel" : "Cancel",
    "Deactivate": "Deactivate",
    "SaveChanges": "Save Changes",
    "AddNewUser": "Add New User",
    "AddUser" : "Add User",
    "CreateGroup" : "Create Group",
    "AddFavourite" : "Add Favourite",
    "UpdateFavourite" : "Update Favourite",
    "Actions" : "Actions",
    "DeleteGroup" : "Delete Group",
    "DeleteFavourite" : "Remove Favourite"
  },
  "Form" : {
    "ErrorsDetected" : "Errors were detected:",
    "Success" : "Success!"
  },
	"Modal" : {
		"DeactivateUser" : {
			"Title": "User Deactivation",
			"Body" : {
				"Part1" : "Are you sure you wish to deactivate user \"",
				"Part2" : "\" (with id:\"",
				"Part3" : "\")?"
			}
		},
		"SaveUserModeChanges": {
			"Title": "Save Changes",
			"Body" : {
				"singular": " row has been modified. Are you sure you want to save this change?",
				"plural": " rows have been modified. Are you sure you want to save these changes?"
			}
		},
		"DeleteGroup": {
		  "Title" : "Delete Group",
		  "Body" : {
		    "Part1" : "Are you sure you wish to delete group \"",
		    "Part2" : "\" ?"
		  }
		},
		"DeleteFavourite": {
      "Title" : "Remove Favourite",
      "Body" : {
        "Part1" : "Are you sure you wish to remove favourite \"",
        "Part2" : "\" ?"
      }
    }
	},
  "FilterBar" : {
    "Filters": "Filters"
  },
	"Counter" : {
		"Users" : "Users",
		"Meters" : "Smart Meters",
		"Devices" : "Amphiro Devices"
  },
	"Error": {
		"400" : "Bad request",
		"403" : "Authentication has failed",
		"404" : "Not found",
		"500" : "Internal server error",
    "SharedErrorCode.AUTHENTICATION": "Authentication has failed. Please try again.",
    "SharedErrorCode.SESSION_EXPIRED": "Your session has expired.",
    "SharedErrorCode.AUTHENTICATION_NO_CREDENTIALS": "Authentication has failed. No credentials.",
    "SharedErrorCode.AUTHORIZATION": "Authorization has failed.",
    "SharedErrorCode.AUTHORIZATION_ANONYMOUS_SESSION": "Authorization has failed. Anonymous session.",
    "SharedErrorCode.AUTHORIZATION_MISSING_ROLE": "Authorization has failed. Missing required role.",
    "ValidationError.User.NO_FIRST_NAME": "First name is missing.",
    "ValidationError.User.NO_LAST_NAME": "Last name is missing.",
    "ValidationError.User.NO_EMAIL": "E-mail address is missing.",
    "ValidationError.User.NO_GENDER": "Gender is missing.",
    "ValidationError.User.NO_UTILITY": "Utility is missing.",
    "ValidationError.User.INVALID_EMAIL": "The E-mail address is invalid.",
    "ValidationError.User.TOO_LONG_FIRST_NAME" : "First name exceeds maximum length (40 characters).",
    "ValidationError.User.TOO_LONG_LAST_NAME" : "Last name exceeds maximum length (70 characters).",
    "ValidationError.User.TOO_LONG_EMAIL" : "E-mail exceeds maximum length (100 characters).",
    "ValidationError.User.TOO_LONG_ADDRESS" : "Address exceeds maximum length (90 characters).",
    "ValidationError.User.TOO_LONG_POSTAL_CODE" : "Postal code exceeds maximum length (10 characters).",
    "UserErrorCode.USERNAME_EXISTS_IN_WHITELIST": "A user with this E-mail already exists in the user white list.",
    "UserErrorCode.PASSWORD_RESET_TOKEN_NOT_FOUND": "Token was not found.",
    "UserErrorCode.PASSWORD_RESET_TOKEN_EXPIRED": "Token has expired.",
    "UserErrorCode.PASSWORD_RESET_TOKEN_ALREADY_REEDEMED": "Token has already been redeemed.",
    "UserErrorCode.PASSWORD_RESET_TOKEN_USER_NOT_FOUND": "User has been deleted.",
    "UserErrorCode.PASSWORD_RESET_PIN_MISMATCH": "Invalid PIN.",
    "UserErrorCode.PASSWORD_RESET_NOT_ALLOWED": "Password reset is disabled.",
    "UserErrorCode.PASSWORD_RESET_APPLICATION_NOT_SUPPORTED": "Application is not supported.",
    "GroupErrorCode.GROUP_EXISTS": "A group with this name already exists.",
    "GroupErrorCode.GROUP_DOES_NOT_EXIST" : "No Group exists with this id.",
    "ValidationError.Group.NO_GROUP_NAME": "Group name is missing",
    "ValidationError.Group.NO_GROUP_MEMBERS": "No Members were assigned to this Group.",
    "ValidationError.Favourite.NO_LABEL": "No Label was entered for this Favourite.",
    "reports": {
      "measurements": {
        "TIMESPAN_INVALID": "The given timespan is invalid.",
        "TIMESPAN_TOO_NARROW": "The given timespan is too narrow.",
        "TIMESPAN_TOO_WIDE": "The given timespan is too wide."
      }  
    },
    "PasswordErrorCode.INVALID_LENGTH": "Password length must be at least 8 characters long.",
    "PasswordErrorCode.VERIFICATION_FAILED": "The two password values do not match.",
    "PasswordErrorCode.CAPTCHA_ERROR": "CAPTCHA value is required."
	}, 
  "Success": {
    "UserSuccess.USER_ADDED_WHITELIST" : "User was succesfully registered in the user white list.",
    "GroupSuccess.GROUP_CREATED" : "Group was succesfully created.",
    "GroupSuccess.GROUP_DELETED" : "Group was succesfully deleted.",
    "FavouriteSuccess.FAVOURITE_ADDED" : "Favourite was succesfully added.",
    "FavouriteSuccess.FAVOURITE_UPDATED" : "Favourite was succesfully updated."
  },
  "Countries": {
    "Greece": "Greece",
    "Spain": "Spain",
    "United Kingdom": "United Kingdom"
  },
  "Timezones": {
    "Europe/London": "UTC",
    "Europe/Madrid": "Madrid",
    "Europe/Athens": "Athens"
  },
  "Gender" : {
    "FEMALE": "Female",
    "MALE": "Male"
  }
}

