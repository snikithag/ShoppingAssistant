import * as yup from "yup";

const schema = yup.object().shape({
    name: yup.string().required(),
    price: yup.number().required(),
    description: yup.string().required(),
    category: yup.string().required(),
    image: yup.string().required(),
});

export default schema;
