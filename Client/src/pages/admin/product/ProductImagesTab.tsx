import React, { useState, type ChangeEvent } from "react";
import axios from "axios";
import type { ProductImage } from "../../../types/ProductImage";

interface Props {
    productId: number | string;
    productImages: ProductImage[];
}

const ProductImagesTab: React.FC<Props> = ({ productId, productImages }) => {
    const [images, setImages] = useState<ProductImage[]>(productImages);
    const [newImage, setNewImage] = useState<File | null>(null);
    const maxImages = 4;

    // Handle preview of new file
    const handleNewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setNewImage(e.target.files[0]);
        }
    };

    // Add new image to list
    const handleAddImage = () => {
        if (!newImage) {
            alert("Please select an image.");
            return;
        }

        const newImageDto: ProductImage = {
            imageId: 0,
            image: URL.createObjectURL(newImage),
            imageUpload: newImage,
        };

        setImages([...images, newImageDto]);
        setNewImage(null);
    };

    // Remove image (also call backend)
    const handleRemoveImage = async (imageId: number) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const response = await axios.post("/Products/RemoveImage", { imageId });
            if (response.data.success) {
                setImages(images.filter((img) => img.imageId !== imageId));
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            alert("Error deleting image.");
        }
    };

    // Submit form with images
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productId", productId.toString());

        images.forEach((img, index) => {
            formData.append(`ProductImages[${index}].ImageId`, img.imageId.toString());
            if (img.imageUpload) {
                formData.append(`ProductImages[${index}].ImageUpload`, img.imageUpload);
            }
        });

        try {
            await axios.post("/Products/SaveImages", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Images saved successfully!");
        } catch (err) {
            alert("Error saving images.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <table className="table">
                <thead>
                    <tr>
                        <th className="col-5">Image</th>
                        <th className="col-5"></th>
                        <th className="col-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <tr key={index}>
                                <td>
                                    <img
                                        alt=""
                                        src={image.image}
                                        className="img-thumbnail"
                                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const file = e.target.files[0];
                                                const updated = [...images];
                                                updated[index] = {
                                                    ...updated[index],
                                                    image: URL.createObjectURL(file),
                                                    imageUpload: file,
                                                };
                                                setImages(updated);
                                            }
                                        }}
                                    />
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveImage(image.imageId)}
                                    >
                                        <i className="fa-solid fa-trash fa-sm"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No images available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* New image upload row */}
            {images.length < maxImages && (
                <div className="row ps-2 mb-3">
                    <div className="col-2">
                        {newImage && (
                            <img
                                alt=""
                                src={URL.createObjectURL(newImage)}
                                className="img-thumbnail"
                                style={{ maxWidth: "150px", maxHeight: "150px" }}
                            />
                        )}
                    </div>
                    <div className="col-3">
                        <input
                            type="file"
                            className="form-control-file"
                            accept="image/*"
                            onChange={handleNewImageChange}
                        />
                    </div>
                    <div className="col-7">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleAddImage}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            )}

            <button type="submit" className="btn btn-primary mt-3">
                <i className="fa-solid fa-floppy-disk fa-sm"></i> Save
            </button>
        </form>

    );
};

export default ProductImagesTab;
