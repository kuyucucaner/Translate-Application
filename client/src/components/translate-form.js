import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setText, setTargetLanguage, setTranslatedText ,setocrDetectedText  , setAnalysis , setSentiment} from '../redux/translation-slice';
import axios from 'axios';

const TranslateForm = () => {
  const dispatch = useDispatch();
  const { text, targetLanguage, translatedText  , ocrDetectedText ,analysis , sentiment} = useSelector((state) => state.translation);
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');

  const handleSentimentAnalysis = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/translate/analyze-sentiment/', { text });
      dispatch(setSentiment(response.data)); // Sentiment sonucunu Redux'a kaydet

    } catch (err) {
      console.error('Error with sentiment analysis:', err);
    }
  };
  
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
       <div>
      <h1 >Text Analysis</h1>
      <textarea
        value={text}
        onChange={(e) => dispatch(setText(e.target.value))}
        placeholder="Enter text to analyze"
   
      />
      <button
        onClick={handleAnalyze}

      >
        Analyze Text
      </button>

      {analysis.wordCount && (
        <div >
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

  <div>
  <h2>Sentiment Analysis</h2>
  {/* Kullanıcının metin girebilmesi için bir alan */}
  <textarea
    value={text} // Redux'tan alınan text
    onChange={(e) => dispatch(setText(e.target.value))} // Redux durumunu güncelliyoruz
    placeholder="Enter text for sentiment analysis"
  
  />
  <button
    onClick={handleSentimentAnalysis} // Analizi başlatmak için fonksiyon
  >
    Analyze Sentiment
  </button>

  {sentiment.sentiment ? (
  <div>
    <p>Sentiment: <strong>{sentiment.sentiment}</strong></p>
    <p>Score: {sentiment.score}</p>
    <ul>
      <h4>Suggestions:</h4>
      {sentiment.suggestions?.map((suggestion, index) => (
        <li key={index}>{suggestion}</li>
      ))}
    </ul>
  </div>
) : (
  <p>No sentiment analysis results available.</p>
)}

</div>


    </div>
  );
};

export default TranslateForm;
