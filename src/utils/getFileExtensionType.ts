import { FileExtensionType } from "../interfaces/datasource";

export function getFileExtensionType(src: string): FileExtensionType {
    try {
      const extension = src.split(".").pop()?.toLowerCase();
  
      switch (extension) {
        case "mp4":
        case "webm":
          return "video";
  
        case "jpeg":
        case "jpg":
        case "png":
        case "gif":
          return "image";
  
        case "zip":
          return "iframe";
  
        default:
          return null;
      }
    } catch (err) {
      return null;
    }
  }