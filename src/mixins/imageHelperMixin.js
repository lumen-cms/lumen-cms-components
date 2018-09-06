import { getImageSrc } from '../util/imageSrcHelper'

export default {
  methods: {

    /**
     *
     * @param fileObj
     * @param [resize]
     * @param [crop]
     * @param {boolean} [isLightbox]
     * @returns {{src: string, alt: false, title: false}}
     */
    getFileAttrs (fileObj, resize, crop, isLightbox) {
      const file = fileObj.file || fileObj
      const cropVal = isLightbox ? false : crop || fileObj.crop
      const resizeVal = isLightbox ? false : resize || fileObj.resize

      return {
        src: file ? getImageSrc(file, cropVal, resizeVal).src : '',
        alt: fileObj.alternative || false,
        title: fileObj.title || false
      }
    }
  }
}
