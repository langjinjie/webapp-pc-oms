import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { message } from 'antd';

import { uploadImage2 } from 'src/apis/marketing';
interface EditorProps {
  // initialValue?: string;
  // handleEditorChange?: (editor: any) => void;
  value?: string;
  onChange?: (content: string) => void;
}
// @ts-ignore
function imageUploadHandler (blobInfo, success, failure, progress) {
  const progressFn = function (e: any) {
    progress((e.loaded / e.total) * 100);
  };

  const formData = new FormData();
  if (blobInfo.blob().size > 1024 * 1024 * 10) {
    failure('上传图片大小限制10M以内');
  }
  // formData.append('file', blobInfo.blob(), blobInfo.filename());
  formData.append('file', blobInfo.blob());
  formData.append('bizKey', 'news');
  uploadImage2(formData, { onUploadProgress: progressFn })
    .then((data) => {
      success(data.filePath);
    })
    .catch((err) => {
      failure('Image upload failed due to a XHR Transport error. Code: ' + err);
    });

  // xhr.send(formData);
}
// @ts-ignore
function filePickerCallback (callback, value, meta) {
  if (meta.filetype === 'media') {
    const input = document.createElement('input'); // 创建一个隐藏的input
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();

    input.onchange = function (e: any) {
      const fileInput = e.target;
      Array.from(fileInput.files).forEach((item: any) => {
        if (item.size > 1024 * 1024 * 100) {
          message.error('上传视频不大于100M');
          return false;
        }
        const formData = new FormData();
        formData.append('file', item);
        formData.append('bizKey', 'media');
        uploadImage2(formData, {}).then((data) => {
          if (data) {
            callback(data.filePath);
          }
        });
      });
    };
  } else if (meta.filetype === 'image') {
    const input = document.createElement('input'); // 创建一个隐藏的input
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = function (e: any) {
      const fileInput = e.target;
      console.log(fileInput.files);
      Array.from(fileInput.files).forEach((item: any) => {
        if (item.size > 1024 * 1024 * 10) {
          message.error('上传图片大小限制10M以内');
        }
        const formData = new FormData();
        formData.append('file', item);
        formData.append('bizKey', 'news');
        uploadImage2(formData, {}).then((data) => {
          if (data) {
            callback(data.filePath);
          }
        });
      });
    };
  }
}

const TinyEditor: React.FC<EditorProps> = (props) => {
  const editorRef = useRef(null);
  const { onChange, value } = props;

  const handleEditorChange = (editor: any): void => {
    onChange?.(editor.getContent());
  };
  return (
    <>
      <Editor
        apiKey="jv782ngskqvvejx3o8u7gjyw310tgqkt0j4vrluu0tk13tac"
        tinymceScriptSrc={
          process.env.NODE_ENV !== 'development'
            ? '/tenacity-oms/' + process.env.BASE_PATH + '/static/tinymce/js/tinymce/tinymce.min.js'
            : '/static/tinymce/js/tinymce/tinymce.min.js'
        }
        // @ts-ignore
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={value}
        init={{
          branding: false,
          height: 600,
          min_height: 400,
          menubar: false,
          language: 'zh_CN',
          plugins: [
            'advlist autolink lists link image media imagetools charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount preview code'
          ],
          tinydrive_token_provider: 'URL_TO_YOUR_TOKEN_PROVIDER',
          images_upload_handler: imageUploadHandler,
          file_picker_callback: filePickerCallback,
          toolbar: [
            'undo redo | formatselect | ' +
              'forecolor backcolor bold italic underline strikethrough link  | \\' +
              'styleselect fontselect fontsizeselect | ',
            'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent lineheight | ' +
              'blockquote subscript superscript removeformat | help ' +
              'image  media  | ' +
              'code preview'
          ],
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          font_formats:
            '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif',
          fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px'
        }}
        onEditorChange={(a, editor) => handleEditorChange(editor)}
      />
    </>
  );
};
export default TinyEditor;
