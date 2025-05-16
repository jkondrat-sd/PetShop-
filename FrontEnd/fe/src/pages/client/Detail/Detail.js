import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getDocumentById,
  likeDocument,
  unlikeDocument,
  downloadDocument,
  rateDocument,
  createReminder,
} from "~/services/documentService";
import {
  Typography,
  Tag,
  Button,
  Row,
  Col,
  Image,
  Rate,
  Input,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  HeartOutlined,
  HeartFilled,
  SaveOutlined,
} from "@ant-design/icons";
import classNames from "classnames/bind";
import styles from "./Detail.module.scss";
import { useSelector } from "react-redux";
import Library from "~/pages/client/LibraryModal";
import LoadingUi from "../Loading";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const cx = classNames.bind(styles);

function Detail() {
  const { documentId } = useParams();
  const [doc, setDoc] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [rating, setRating] = useState(0); // Đánh giá sao
  const [review, setReview] = useState(""); // Nội dung review
  const isLoggedIn = useSelector((state) => state.loginReducer.isLoggedIn);

  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true);
        const res = await getDocumentById(Number(documentId));
        if (res.code === 200) {
          setDoc(res.result);
          setLiked(res.result.liked);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDocument();
  }, [documentId, isLoggedIn, navigate]);

  if (loading) {
    return (
      <div className={cx("loading-container")}>
        <LoadingUi />
      </div>
    );
  }
  if (!doc) {
    return (
      <div className={cx("error-container")}>
        <h2>Không tìm thấy tài liệu</h2>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(doc.documentIndex.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.documentIndex.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      await downloadDocument(doc.documentIndex.id);
    } catch (error) {
      console.error("Lỗi khi tải xuống tài liệu:", error);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeDocument(doc.documentIndex.id);
      } else {
        await likeDocument(doc.documentIndex.id);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Lỗi khi xử lý thích/bỏ thích tài liệu:", error);
    }
  };

  const handleRateDocument = async () => {
    try {
      const ratingData = {
        rating: Number(rating),
        review: review,
      };
      await rateDocument(doc.documentIndex.id, ratingData); // Gửi yêu cầu đánh giá
      alert("Đánh giá thành công!");
    } catch (error) {
      console.error("Lỗi khi đánh giá tài liệu:", error);
    }
  };

  const handleCreateReminder = async () => {
    try {
      const reminderData = {
        title: reminderTitle,
        description: reminderDescription,
        remindAt: new Date(reminderTime).toISOString(),
        // Định dạng đúng ISO 8601 nếu input là datetime-local
      };
      console.log(reminderData);
      await createReminder(doc.documentIndex.id, reminderData);
      alert("Tạo nhắc nhở thành công!");
      setReminderTitle("");
      setReminderDescription("");
      setReminderTime("");
    } catch (error) {
      console.error("Lỗi khi tạo nhắc nhở:", error);
      alert("Tạo nhắc nhở thất bại.");
    }
  };

  return (
    <div className={cx("detail-container")}>
      <Paragraph>
        <strong>Chuyên mục:</strong>{" "}
        <Tag color="green">{doc.category.name}</Tag>
      </Paragraph>

      <h1 className={cx("document-title")}>{doc.documentIndex.title}</h1>

      <Paragraph>
        <strong>Lượt xem:</strong> <EyeOutlined /> {doc.views} &nbsp;&nbsp;
        <strong>Lượt like:</strong> <HeartFilled /> {doc.like} &nbsp;&nbsp;
        <strong>Lượt tải:</strong> <DownloadOutlined /> {doc.downloads}
      </Paragraph>

      <div className={cx("preview")}>
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Button
            type="primary"
            style={{
              backgroundColor: "rgb(255, 170, 0)",
              borderColor: "rgb(255, 170, 0)",
              marginBottom: "16px",
            }}
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Tải xuống
          </Button>
          <div className={cx("actions")}>
            <Button
              icon={liked ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleLike}
              className={`${styles["like-button"]} ${
                liked ? styles.liked : ""
              }`}
              style={{ marginRight: "16px" }}
            >
              {liked ? "Đã thích" : "Thích"}
            </Button>

            <Button
              icon={<SaveOutlined />}
              onClick={() => setShowLibraryModal(true)}
              className={cx("save-button")}
            >
              Thêm vào thư viện
            </Button>
          </div>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <div className={cx("preview-images")}>
              <Image.PreviewGroup>
                {doc.documentIndex.previewUrls.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className={cx("preview-image")}
                    preview={{ visible: false }}
                  />
                ))}
              </Image.PreviewGroup>
            </div>
          </Col>
        </Row>

        <Row justify="center">
          <Col>
            <Button
              type="primary"
              style={{
                backgroundColor: "rgb(255, 170, 0)",
                borderColor: "rgb(255, 170, 0)",
                fontSize: "20px",
                padding: "10px 20px",
              }}
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              Tải xuống tài liệu
            </Button>
          </Col>
        </Row>
      </div>

      <Paragraph className={cx("des")}>
        {doc.documentIndex.description}
      </Paragraph>

      <div className={cx("rate-section")}>
        <Title level={3}>Đánh giá tài liệu</Title>
        <Rate
          allowHalf
          value={rating}
          onChange={setRating}
          style={{ marginBottom: 16 }}
        />
        <TextArea
          rows={4}
          placeholder="Viết review của bạn..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <Button
          type="primary"
          style={{ marginTop: 16 }}
          onClick={handleRateDocument}
        >
          Gửi đánh giá
        </Button>
      </div>
      <div className={cx("tags")}>
        {doc.documentIndex.tags.map((tag, index) => (
          <Tag key={index} color="blue">
            {tag}
          </Tag>
        ))}
      </div>

      {/* Phần đánh giá tài liệu */}

      <div className={cx("reminder-section")} style={{ marginTop: 32 }}>
        <Title level={3}>Tạo nhắc nhở</Title>
        <Input
          placeholder="Tiêu đề nhắc nhở"
          value={reminderTitle}
          onChange={(e) => setReminderTitle(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <TextArea
          rows={2}
          placeholder="Mô tả nhắc nhở"
          value={reminderDescription}
          onChange={(e) => setReminderDescription(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Input
          type="datetime-local"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" onClick={handleCreateReminder}>
          Gửi nhắc nhở
        </Button>
      </div>

      {showLibraryModal && (
        <Library
          onClose={() => setShowLibraryModal(false)}
          documentId={doc.documentIndex.id}
        />
      )}
    </div>
  );
}

export default Detail;
