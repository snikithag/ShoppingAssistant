import * as yup from "yup";

const dealerSignupSchema = yup.object().shape({
    owner: yup.string().required("Enter your username"),
    merchandise: yup.string().required("Enter your merchandise"),
    email: yup.string().email("Invalid email format").required("Enter your email"),
    password: yup.string().required("Enter your password"),
    mobile: yup.string().required("Enter your mobile number"),
    address: yup.string().required("Enter your address"),
});

export const emailSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Enter your email"),
});

export const resetSchema = yup.object().shape({
    password: yup.string().required("Enter your password"),
    cpassword: yup
        .string()
        .required("Confirm your password")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export default dealerSignupSchema;
