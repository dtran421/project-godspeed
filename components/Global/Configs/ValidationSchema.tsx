import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email required"),
	password: Yup.string()
		.required("Please provide a password")
		.min(8, "Password must contain at least 8 characters")
		.matches(
			/^.*(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
			"Password must contain at least one uppercase and one number"
		)
});

export const RegisterSchema = Yup.object().shape({
	email: Yup.string().email("Invalid email").required("Email required"),
	password: Yup.string()
		.required("Please provide a password")
		.min(8, "Password must contain at least 8 characters")
		.matches(
			/^.*(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
			"Password must contain at least one uppercase and one number"
		),
	confirmPassword: Yup.string()
		.required("Please confirm your password")
		.when("password", {
			is: (password) => (password && password.length > 0 ? true : false),
			then: Yup.string().oneOf(
				[Yup.ref("password")],
				"Passwords don't match"
			)
		})
});

export const ListSchema = Yup.object().shape({
	listName: Yup.string().required("Please enter a name")
});

export const DeletionSchema = Yup.object().shape({
	listName: Yup.string().required("Please confirm the watchlist's name")
});

const phoneNumberRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const UserInfoSchema = Yup.object().shape({
	name: Yup.string(),
	email: Yup.string().email("Invalid email"),
	phoneNumber: Yup.string().matches(
		phoneNumberRegex,
		"Phone number is not valid"
	)
});
