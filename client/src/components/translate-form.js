import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setText, setTargetLanguage, setTranslatedText ,setocrDetectedText  , setAnalysis} from '../redux/translation-slice';
import axios from 'axios';

const TranslateForm = () => {
  const dispatch = useDispatch();
  const { text, targetLanguage, translatedText  , ocrDetectedText ,analysis} = useSelector((state) => state.translation);
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
  const handleAnalyze = async () => {
    if (!text) {
      alert('Please enter text to analyze.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/translate/analyze-text', { text });
      dispatch(setAnalysis(response.data));
    } catch (err) {
      console.error('Error analyzing text:', err);
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
       <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Text Analysis</h1>
      <textarea
        value={text}
        onChange={(e) => dispatch(setText(e.target.value))}
        placeholder="Enter text to analyze"
        style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '10px' }}
      />
      <button
        onClick={handleAnalyze}
        style={{
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Analyze Text
      </button>

      {analysis.wordCount && (
        <div style={{ marginTop: '20px' }}>
          <h3>Analysis Results:</h3>
          <ul>
            <li>Word Count: {analysis.wordCount}</li>
            <li>Sentence Count: {analysis.sentenceCount}</li>
            <li>Unique Words: {analysis.uniqueWords}</li>
            <li>Average Word Length: {analysis.avgWordLength} characters</li>
          </ul>
        </div>
      )}
    </div>
    </div>
  );
};

export default TranslateForm;
