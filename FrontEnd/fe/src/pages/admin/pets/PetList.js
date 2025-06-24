import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Table,
	Card,
	Button,
	Space,
	Input,
	Tag,
	Image,
	Typography,
	Dropdown,
	message,
	Popconfirm,
	Row,
	Col,
	Select,
} from "antd";
import {
	PlusOutlined,
	SearchOutlined,
	EditOutlined,
	DeleteOutlined,
	FilterOutlined,
	ExportOutlined,
	ImportOutlined,
	EllipsisOutlined,
	EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchPets, removePet } from "../../../redux/actions/petActions";
import { getBreeds } from "../../../services/breedService";
import "./PetList.scss";
import "animate.css";

const { Title } = Typography;
const { Option } = Select;

const PetList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		pets = [],
		loading,
		pagination = {},
		operationLoading,
	} = useSelector((state) => state.pet);

	const [filters, setFilters] = useState({
		type: "",
		breedId: "",
		search: "",
	});
	const [breeds, setBreeds] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	useEffect(() => {
		loadPets();
		loadBreeds();
	}, [currentPage, pageSize, filters.type, filters.breedId]);

	useEffect(() => {
		console.log("Current pets in state:", pets);
		console.log("Pagination info:", pagination);
	}, [pets, pagination]);

	const loadPets = async () => {
		const params = {
			page: currentPage,
			size: pageSize,
			type: filters.type || undefined,
			breedId: filters.breedId || undefined,
		};

		try {
			console.log("Fetching pets with params:", params);
			const response = await dispatch(fetchPets(params));
			console.log("API response:", response);
		} catch (error) {
			console.error("Error loading pets:", error);
			message.error("Failed to load pets data");
		}
	};

	const loadBreeds = async () => {
		try {
			const response = await getBreeds();
			if (response?.content) {
				setBreeds(response.content);
			} else if (Array.isArray(response)) {
				setBreeds(response);
			}
		} catch (error) {
			console.error("Failed to load breeds:", error);
			message.error("Failed to load breeds list");
		}
	};

	const handleEdit = (petId) => {
		navigate(`/admin/pets/edit/${petId}`);
	};

	const handleView = (petId) => {
		navigate(`/admin/pets/${petId}`);
	};

	const handleDelete = async (petId) => {
		try {
			await dispatch(removePet(petId));
			message.success("Pet deleted successfully!");
			loadPets(); // Reload data
		} catch (error) {
			message.error("Failed to delete pet: " + error.message);
		}
	};

	const handleFilterChange = (field, value) => {
		setFilters({
			...filters,
			[field]: value,
		});
		setCurrentPage(0); // Reset to first page
	};

	const handleSearch = (value) => {
		setFilters({
			...filters,
			search: value,
		});
		setCurrentPage(0);
	};

	const handlePageChange = (page, size) => {
		setCurrentPage(page - 1); // Ant Design uses 1-based pagination
		setPageSize(size);
	};

	const handleMoreAction = ({ key }) => {
		if (key === "import") {
			message.info("Feature in development");
		} else if (key === "export") {
			message.info("Feature in development");
		}
	};

	// Map type values for display
	const getTypeDisplay = (type) => {
		const typeMap = {
			DOG: "Dog",
			CAT: "Cat",
		};
		return typeMap[type] || type;
	};

	// Map gender values for display
	const getGenderDisplay = (gender) => {
		const genderMap = {
			MALE: "Male",
			FEMALE: "Female",
		};
		return genderMap[gender] || gender || "-";
	};

	// Map status values for display
	const getStatusDisplay = (status) => {
		const statusMap = {
			available: { text: "Available", color: "success" },
			sold: { text: "Sold", color: "default" },
			reserved: { text: "Reserved", color: "warning" },
		};
		return statusMap[status] || { text: status, color: "default" };
	};

	const columns = [
		{
			title: 'STT',
			key: 'stt',
			width: 60,
			align: 'center',
			render: (_text, _record, index) => currentPage * pageSize + index + 1,
		},
		{
			title: "Image",
			dataIndex: "thumbnail",
			key: "thumbnail",
			width: 100,
			render: (thumbnail) => (
				<Image
					src={thumbnail || "https://via.placeholder.com/80x60?text=No+Image"}
					width={80}
					height={60}
					style={{ objectFit: "cover", borderRadius: "8px" }}
					placeholder={<div className="image-placeholder" />}
					fallback="https://via.placeholder.com/80x60?text=Error"
				/>
			),
		},
		{
			title: "Pet Name",
			dataIndex: "petName",
			key: "petName",
			sorter: (a, b) => (a.petName || "").localeCompare(b.petName || ""),
			render: (text) => <span className="pet-name">{text || "-"}</span>,
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
			render: (type) => {
				const colorMap = {
					DOG: "geekblue",
					CAT: "purple",
				};
				const color = colorMap[type] || "default";
				return <Tag color={color}>{getTypeDisplay(type)}</Tag>;
			},
		},
		{
			title: "Breed",
			dataIndex: "breed",
			key: "breed",
			render: (breed) => breed || "-",
		},
		{
			title: "Gender",
			dataIndex: "gender",
			key: "gender",
			render: (gender) => getGenderDisplay(gender),
		},
		{
			title: "Age (months)",
			dataIndex: "age",
			key: "age",
			render: (age) => (age ? `${age} months` : "-"),
		},
		{
			title: "Price",
			dataIndex: "unitPrice",
			key: "unitPrice",
			sorter: (a, b) => (a.unitPrice || 0) - (b.unitPrice || 0),
			render: (price) =>
				price ? (
					<span className="pet-price">{price.toLocaleString("en-US")}$</span>
				) : (
					<span>-</span>
				),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (status) => {
				const { text, color } = getStatusDisplay(status);
				return <Tag color={color}>{text}</Tag>;
			},
		},
		{
			title: "Actions",
			key: "action",
			width: 180,
			render: (_, record) => (
				<Space size="small" className="action-buttons">
					<Button
						type="default"
						icon={<EyeOutlined />}
						size="small"
						onClick={() => handleView(record.petId)}
						className="view-button"
					>
						View
					</Button>
					<Button
						type="primary"
						icon={<EditOutlined />}
						size="small"
						onClick={() => handleEdit(record.petId)}
						className="edit-button"
					>
						Edit
					</Button>
					<Popconfirm
						title="Are you sure you want to delete this pet?"
						okText="Yes"
						cancelText="No"
						onConfirm={() => handleDelete(record.petId)}
					>
						<Button
							danger
							icon={<DeleteOutlined />}
							size="small"
							className="delete-button"
							loading={operationLoading}
						>
							Delete
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const moreActions = [
		{
			key: "import",
			label: "Import Excel",
			icon: <ImportOutlined />,
		},
		{
			key: "export",
			label: "Export Excel",
			icon: <ExportOutlined />,
		},
	];

	return (
		<div className="pets-list-page animate__animated animate__fadeIn">
			<div className="page-header">
				<Title level={2} className="page-title">
					Pet Management
				</Title>
				<Button
					type="primary"
					icon={<PlusOutlined />}
					onClick={() => navigate("/admin/pets/create")}
					className="add-button animate__animated animate__bounceIn"
				>
					Add New
				</Button>
			</div>

			<Card bordered={false} className="list-card">
				<Row gutter={[16, 16]} className="filter-row">
					<Col xs={24} md={8} lg={6}>
						<Input.Search
							placeholder="Search by name..."
							onSearch={handleSearch}
							className="search-input"
							allowClear
							disabled
						/>
					</Col>
					<Col xs={12} md={5} lg={4}>
						<Select
							placeholder="Pet Type"
							style={{ width: "100%" }}
							onChange={(value) => handleFilterChange("type", value)}
							allowClear
						>
							<Option value="DOG">Dog</Option>
							<Option value="CAT">Cat</Option>
						</Select>
					</Col>
					<Col xs={12} md={5} lg={4}>
						<Select
							placeholder="Breed"
							style={{ width: "100%" }}
							onChange={(value) => handleFilterChange("breedId", value)}
							allowClear
						>
							{Array.isArray(breeds) &&
								breeds.map((breed) => (
									<Option key={breed.id} value={breed.id}>
										{breed.breedName}
									</Option>
								))}
						</Select>
					</Col>
					<Col xs={24} md={6} className="action-col">
						<Space className="filter-actions">
							<Button icon={<FilterOutlined />} onClick={loadPets}>
								Refresh
							</Button>
							<Dropdown
								menu={{
									items: moreActions,
									onClick: handleMoreAction,
								}}
								placement="bottomRight"
							>
								<Button icon={<EllipsisOutlined />}>More</Button>
							</Dropdown>
						</Space>
					</Col>
				</Row>

				<Table
					columns={columns}
					dataSource={Array.isArray(pets) ? pets : []}
					rowKey="petId"
					loading={loading}
					pagination={{
						current: currentPage + 1,
						pageSize: pageSize,
						total: pagination?.totalElements || 0,
						showSizeChanger: true,
						pageSizeOptions: ["10", "20", "50"],
						showTotal: (total, range) =>
							`${range[0]}-${range[1]} of ${total} pets`,
						onChange: handlePageChange,
						onShowSizeChange: handlePageChange,
					}}
					className="data-table"
					scroll={{ x: 1200 }}
				/>
			</Card>
		</div>
	);
};

export default PetList;
