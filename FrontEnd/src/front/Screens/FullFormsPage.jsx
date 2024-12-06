import { LoginForm } from "../Components/LoginForm.jsx";
import { RegisterForm } from "../Components/RegisterForm.jsx";
import { Recuperar } from "../Components/Recuperar.jsx"

export function FullFormsPage({ formType }) {
    return (
        <>
            <div className="background"></div>
            {formType === 'login' && <LoginForm />}
            {formType === 'register' && <RegisterForm />}
            {formType === 'recuperar' && <Recuperar />} 
        </>
    );
}