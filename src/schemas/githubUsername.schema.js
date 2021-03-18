import * as yup from "yup";

export const githubUsernameSchema = yup.object({
  username: yup
    .string()
    .required("Please enter a Github username")
    .max("20", "A maximum of 20 characters are allowed"),
});
