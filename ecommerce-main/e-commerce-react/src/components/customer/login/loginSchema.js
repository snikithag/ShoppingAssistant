import * as yup from "yup";

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Enter your email"),
    password: yup.string().required("Enter your password"),
});

export default loginSchema;
