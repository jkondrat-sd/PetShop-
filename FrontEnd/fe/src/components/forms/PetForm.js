import React, { useState, useEffect } from "react";
import {
	Form,
	Input,
	Button,
	Select,
	InputNumber,
	Upload,
	Row,
	Col,
	Spin,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { getBreeds } from "../../services/petService";

const { Option } = Select;
const { TextArea } = Input;

const PetForm = ({
	initialValues,
	onFinish,
	loading,
	submitButtonText = "Save",
}) => {
	const [form] = Form.useForm();
	const [breeds, setBreeds] = useState([]);
	const [imageLoading, setImageLoading] = useState(false);
	const [thumbnailImage, setThumbnailImage] = useState(null);
	const [imageList, setImageList] = useState([]);
	const [thumbnailPreview, setThumbnailPreview] = useState(
		initialValues?.thumbnail
	);

	useEffect(() => {
		fetchBreeds();

		if (initialValues) {
			form.setFieldsValue(initialValues);

			if (initialValues.thumbnail) {
				setThumbnailPreview(initialValues.thumbnail);
			}

			if (initialValues.images && initialValues.images.length > 0) {
				setImageList(
					initialValues.images.map((url, index) => ({
						uid: `-${index}`,
						name: `image-${index}.png`,
						status: "done",
						url: url,
						thumbUrl: url,
					}))
				);
			}
		}
	}, [initialValues, form]);

	const fetchBreeds = async () => {
		try {
			const response = await getBreeds();
			if (response?.content) {
				setBreeds(response.content);
			}
		} catch (error) {
			console.error("Failed to fetch breeds:", error);
		}
	};

	const normFile = (e) => {
		if (Array.isArray(e)) {
			return e;
		}
		return e?.fileList;
	};

	const beforeUpload = (file) => {
		const isImage = file.type.startsWith("image/");
		const isLt5M = file.size / 1024 / 1024 < 5;
		return isImage && isLt5M;
	};

	const handleThumbnailChange = (info) => {
		if (info.file.status === "uploading") {
			setImageLoading(true);
			return;
		}
		if (info.file.status === "done") {
			setImageLoading(false);
			setThumbnailImage(info.file.originFileObj);
			setThumbnailPreview(URL.createObjectURL(info.file.originFileObj));
		}
	};

	const handleImagesChange = ({ fileList }) => {
		setImageList(fileList);
	};

	const handleSubmit = (values) => {
		const petData = {
			...values,
		};

		const images = imageList
			.filter((file) => file.originFileObj)
			.map((file) => file.originFileObj);

		onFinish(petData, thumbnailImage, images);
	};

	const uploadButton = (
		<div>
			{imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

	return (
		<Spin spinning={loading}>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
				initialValues={{
					status: "available",
					// quantity: 1,
					...initialValues,
				}}
			>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="petName"
							label="Pet Name"
							rules={[
								{ required: true, message: "Vui lòng nhập tên thú cưng" },
							]}
						>
							<Input placeholder="Nhập tên thú cưng" />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							name="unitPrice"
							label="Price"
							rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
						>
							<InputNumber
								style={{ width: "100%" }}
								formatter={(value) =>
									`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
								}
								parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
								placeholder="Nhập giá bán"
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={8}>
						<Form.Item
							name="type"
							label="Type"
							rules={[
								{ required: true, message: "Vui lòng chọn loại thú cưng" },
							]}
						>
							<Select placeholder="Chọn loại thú cưng">
								<Option value="DOG">Dog</Option>
								<Option value="CAT">Cat</Option>
							</Select>
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item
							name="breedId"
							label="Breed"
							rules={[
								{ required: true, message: "Vui lòng chọn giống thú cưng" },
							]}
						>
							<Select placeholder="Chọn giống thú cưng">
								{breeds.map((breed) => (
									<Option key={breed.id} value={breed.id}>
										{breed.breedName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>

					<Col span={8}>
						<Form.Item
							name="gender"
							label="Giới tính"
							rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
						>
							<Select placeholder="Chọn giới tính">
								<Option value="MALE">Đực</Option>
								<Option value="FEMALE">Cái</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="age"
							label="Tuổi"
							rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}
						>
							<InputNumber min={0} max={20} style={{ width: "100%" }} />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name="status" label="Trạng thái">
							<Select>
								<Option value="available">Còn hàng</Option>
								<Option value="out_of_stock">Hết hàng</Option>
								<Option value="LOW_STOCK">Sắp hết hàng</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item name="description" label="Description">
					<TextArea rows={4} placeholder="Nhập mô tả chi tiết về thú cưng" />
				</Form.Item>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="thumbnail"
							label="Thumbnail"
							valuePropName="fileList"
							getValueFromEvent={normFile}
						>
							<Upload
								name="thumbnail"
								listType="picture-card"
								showUploadList={false}
								beforeUpload={beforeUpload}
								onChange={handleThumbnailChange}
								customRequest={({ file, onSuccess }) => {
									setTimeout(() => {
										onSuccess("ok");
									}, 0);
								}}
							>
								{thumbnailPreview ? (
									<img
										src={thumbnailPreview}
										alt="thumbnail"
										style={{ width: "100%" }}
									/>
								) : (
									uploadButton
								)}
							</Upload>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							name="images"
							label="Images"
							valuePropName="fileList"
							getValueFromEvent={normFile}
						>
							<Upload
								name="images"
								listType="picture-card"
								fileList={imageList}
								beforeUpload={beforeUpload}
								onChange={handleImagesChange}
								multiple
								customRequest={({ file, onSuccess }) => {
									setTimeout(() => {
										onSuccess("ok");
									}, 0);
								}}
							>
								{imageList.length >= 8 ? null : uploadButton}
							</Upload>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading}>
						{submitButtonText}
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
};

export default PetForm;
