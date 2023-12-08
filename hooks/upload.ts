
export const useUpload = () => {

  const uploadByFile = async (file: File | Blob, mimetype = 'image/png') => {
    const result = await fetch(`/api/upload?mimetype=${mimetype}`).then(d => d.json())

    if (result.code !== 0) {
      return {
        errMsg: 'presigned failed!'
      }
    }

    const { url, presignedUrl } = result.data

    const awsResult = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        contentType: 'image/png',
      },
      body: file
    })
    if (awsResult.status !== 200) {
      return {
        errMsg: 'aws put failed!'
      }
    }

    return {
      url
    }
  }

  return {
    uploadByFile
  }
}