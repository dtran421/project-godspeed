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
