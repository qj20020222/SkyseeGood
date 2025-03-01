import { SetStateAction, useState } from 'react';
import axios from 'axios'
import { Button, Text, View, Alert } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
function FileUpload() {
    const [file, setFile] = useState<DocumentPickerResponse | null>(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
    const [uploadedFileMimeType, setUploadedFileMimeType] = useState<string | null>(null);

    const handleFilePick = async () => {
      try {
        const result = await DocumentPicker.pick({
          type: [
            DocumentPicker.types.pdf,
            DocumentPicker.types.doc,
            DocumentPicker.types.docx,
          ],
        });
        setFile(result[0]);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // 用户取消了选择
        } else {
          console.error('选择文件时出错:', err);
          Alert.alert('错误', '选择文件时发生错误');
        }
      }
    };


    const handleSubmit = async () => {
      if (!file) {
        setStatus('please select a file');
        return;
      }
      
      if (!file.size) {
        setStatus('please select a file');
        return;
      }
      // 文件大小验证 (1MB = 1000000 bytes)
      if (file.size > 1000000) {
        setStatus('文件大小超过限制 (1MB)');
        return;
      }
  
      setLoading(true);
      setStatus('loading...');
  
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
  
      try {
        const response = await axios.post('http://10.0.2.2:3000/graphql/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        });
        const { path, mimetype } = response.data.file;
        setUploadedFilePath(path);
        setUploadedFileMimeType(mimetype);
        setStatus('success!');
        console.log('upload result:', response.data);
      } catch (error) {
        const e = error as any
        const errorMsg = e.response?.data?.message || e.message;
        setStatus(`upload failed: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    return (
      <View style={{ padding: 20 }}>
        <Button title="choose your file" onPress={handleFilePick} />
        {file && (
          <Text style={{ marginTop: 10 }}>
            chosen: {file.name} 
          </Text>
        )}
        <Button 
          title={loading ? "loading..." : "upload it"} 
          onPress={handleSubmit} 
          disabled={loading || !file} 
        />
        {status ? <Text style={{ marginTop: 10 }}>{status}</Text> : null}
        
        {/* 显示上传后的文件信息 */}
        {uploadedFilePath && (
          <Text style={{ marginTop: 10 }}>文件路径: {uploadedFilePath}</Text>
        )}
        {uploadedFileMimeType && (
          <Text style={{ marginTop: 5 }}>文件类型: {uploadedFileMimeType}</Text>
        )}
      </View>
    );


    }

    

