import { SetStateAction, useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Text, View, Alert } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { useQuery } from '@apollo/client';
import { GET_ARTICLE_BY_CV } from '@/services/graphql/news/Apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function FileUpload() {
    const [file, setFile] = useState<DocumentPickerResponse | null>(null);
    const [status, setStatus] = useState('');
    const [Loading, setLoading] = useState(false);
    const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
    const [uploadedFileMimeType, setUploadedFileMimeType] = useState<string | null>(null);

    const { loading, error, data } = useQuery(GET_ARTICLE_BY_CV, {
      variables: { 
        filepath: uploadedFilePath, 
        filetype: uploadedFileMimeType 
      },
      skip: !uploadedFilePath || !uploadedFileMimeType, // 当条件不满足时跳过查询
      onError: (err) => {
        console.log('完整错误对象:', err);
        console.log('网络错误详情:', err.networkError);
      }
    });

    useEffect(() => {
      if (data && data.findbyCV) {
        const updateStoredIds = async () => {
          try {
            const idValues = data.findbyCV.map((item: { _id: any }) => item._id);
            await AsyncStorage.setItem('my-key', JSON.stringify(idValues));
            console.log('ID 列表已成功更新到 AsyncStorage');
          } catch (e) {
            console.error('保存 ID 列表失败:', e);
          }
        };
        
        updateStoredIds();
      }
    }, [data]); 

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
        const response = await axios.post('http://10.0.2.2:3000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        });
        const { path, mimetype } = response.data.file;
        setUploadedFilePath(path);
        console.log('upload path:', uploadedFilePath);
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
          title={Loading ? "loading..." : "upload it"} 
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

    

