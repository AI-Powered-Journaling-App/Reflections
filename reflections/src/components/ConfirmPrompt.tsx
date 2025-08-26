

import "../styles/Overlay.css";
import "../styles/ConfirmPrompt.css";

type ConfirmPromptType = {
    prompt: string,
    onNo: () => void,
    onYes: () => void,
};

const ConfirmPrompt: React.FC<ConfirmPromptType> = ({ prompt, onNo, onYes }) => {
    return (
        <div className="overlay">
            <div className="confirm-prompt-container">
                <span className="prompt" >{prompt}</span>
                <div className="prompt-buttons">
                    <button onClick={onNo} className="no">No</button>
                    <button onClick={onYes} className="yes">Yes</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPrompt;