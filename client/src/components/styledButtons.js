function TextButton({ text, onClickFunction }){
    return(
        <button class="bg-blue hover:bg-gold text-white font-bold py-2 px-4 border rounded"
        // style={{ backgroundColor: '#043763'}}
        onClick={onClickFunction}>
            {text}
        </button>
    );
}

export default TextButton;
