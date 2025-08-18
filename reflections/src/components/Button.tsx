import "../styles/Button.css";

type ButtonProps = {
    text: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>,
};

const Button = ({ text, onClick }: ButtonProps) => {
    return (
        <>
            <div className="button-container">
                <button onClick={onClick}>{text}</button>
            </div>
        </>
    );
}

export default Button;