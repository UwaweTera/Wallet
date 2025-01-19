import * as yup from "yup";

export const schema = yup.object({
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .typeError("Amount must be a number"),
  category: yup.string().required("Category is required"),
  date: yup
    .date()
    .required("Date is required")
    .max(new Date(), "Cannot select future dates")
    .typeError("Invalid date"),
  description: yup
    .string()
    .required("Description is required")
    .min(3, "Description must be at least 3 characters"),
});


export const SignupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
