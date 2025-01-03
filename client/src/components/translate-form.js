import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setText, setTargetLanguage, setTranslatedText ,setocrDetectedText } from '../redux/translation-slice';
import axios from 'axios';

const TranslateForm = () => {
  const dispatch = useDispatch();
  const { text, targetLanguage, translatedText  , ocrDetectedText} = useSelector((state) => state.translation);
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');

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

  const handleImageUpload = async () => {
    if (!file || !targetLanguage) {
      alert('Please select a file and target language.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('targetLanguage', targetLanguage);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/translate/ocr-translate/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      setOcrResult(response.data.detectedText);
      dispatch(setocrDetectedText(response.data.detectedText));
      dispatch(setTranslatedText(response.data.translatedText));

    } catch (err) {
      console.error('Error with OCR or translation:', err);
    }
  };

  return (
    <div>
      {/* Metin Çevirisi */}
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

      {/* Resim Yükleme ve OCR */}
      <div>
        <h2>Image to Text Translation</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleImageUpload}>Upload and Translate</button>
      </div>

      {ocrResult && (
        <div>
         <h3>OCR Detected Text:</h3>
            <p>{ocrDetectedText}</p>
            <h3>Translated Text:</h3>
            <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default TranslateForm;
