import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setText, setTargetLanguage, setTranslatedText } from '../redux/translation-slice';
import axios from 'axios';

const TranslateForm = () => {
  const dispatch = useDispatch();
  const { text, targetLanguage, translatedText } = useSelector((state) => state.translation);

  const handleTranslate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/translate/', {
        text,
        targetLanguage,
      });
      
      dispatch(setTranslatedText(response.data.translatedText));
    } catch (err) {
      console.error('Error translating:', err);
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => dispatch(setText(e.target.value))}
        placeholder="Please enter a text"
      />
      <select
        value={targetLanguage}
        onChange={(e) => dispatch(setTargetLanguage(e.target.value))}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
      </select>
      <button onClick={handleTranslate}>Translate</button>
      <div>
        <h2>Translation Result:</h2>
        <p>{translatedText}</p>
      </div>
    </div>
  );
};

export default TranslateForm;
