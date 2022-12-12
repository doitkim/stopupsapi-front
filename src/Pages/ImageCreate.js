import axios from "axios";
import style from "../CSS/Home/MenuCreate.module.css";

const ImageCreate = ({ apiKey }) => {
  const imageCreate = async (e) => {
    // 메뉴 등록
    e.preventDefault();
    // const Id = e.target.Id.value;
    // const Name = e.target.Name.value;
    // const Image = e.target.Image.value;
    // const Desc = e.target.Desc.value;
    const formData = new FormData();
    formData.append("Id", e.target.Id.value);
    formData.append("Name", e.target.Name.value);
    formData.append("Image", e.target.Image.value);
    formData.append("Desc", e.target.Desc.value);
    formData.append("file", e.target.ImgFile.files[0]);
    try {
      await axios.post(process.env.REACT_APP_API + "/image/create", formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={imageCreate} className={style.menuCreateForm}>
      <h1>이미지 등록</h1>
      <input
        type="text"
        name="Id"
        placeholder="이미지 고유번호 (필수)"
        required
      />
      <input type="text" name="Name" placeholder="이름 (필수)" required />
      <input type="text" name="Image" placeholder="이미지" />
      <input
        type="file"
        name="ImgFile"
        accept="image/*"
        placeholder="이미지파일"
      />
      <input type="textarea" name="Desc" placeholder="상세 설명" />
      <button>등록</button>
    </form>
  );
};

export default ImageCreate;
