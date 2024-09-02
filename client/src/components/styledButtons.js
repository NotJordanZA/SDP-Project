function TextButton({ text, onClickFunction }){
    return(
        <button className="bg-blue hover:bg-gold text-white font-bold py-2 px-4 border rounded"
        onClick={onClickFunction}>
            {text}
        </button>
    );
}

export default TextButton;
