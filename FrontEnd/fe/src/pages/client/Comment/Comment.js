import { useEffect, useState } from "react";
import { Button, Input, List, Avatar, Tooltip, message, Modal } from "antd";
import { CommentOutlined, LikeOutlined, SendOutlined } from "@ant-design/icons";
import {
  getComments,
  likeComment,
  addComment,
} from "~/services/commentService";
import classNames from "classnames/bind";
import styles from "./Comment.module.scss";
import { getCookie } from "~/helpers/cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showAlert } from "~/redux/actions/alert";
import moment from "moment";
import "moment/locale/vi";

const cx = classNames.bind(styles);

const Comment = ({ documentId }) => {
  const token = getCookie("token");
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(10);
  const dispatch = useDispatch();

  const formatDate = (date) => {
    moment.locale("vi");
    return moment(date).format("HH:mm - DD/MM/YYYY");
  };

  const showModal = async () => {
    if (!token) {
      dispatch(showAlert("Vui lòng đăng nhập để đọc bình luận", "warning"));
      navigate("/"); // Redirect to login page
      return;
    }
    setIsModalVisible(true);
    await fetchComments();
    setSize(10);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // Reset size when modal closes
    setSize(10);
  };

  const fetchComments = async (requestSize) => {
    try {
      setLoading(true);
      const response = await getComments(documentId, 0, requestSize || size);
      console.log("comments", response);
      if (response.code === 200) {
        setComments(response.result.content);
        setTotal(response.result.totalElements);
      }
    } catch (error) {
      message.error("Không thể tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setSize((prevSize) => prevSize + 10);
    fetchComments();
  };

  const handleSubmitComment = async () => {
    if (!content.trim()) return;
    const data = {
      content: content,
      parentId: "",
    };

    try {
      const response = await addComment(documentId, data);
      if (response.code === 200) {
        setContent("");
        fetchComments();
        message.success("Đã thêm bình luận");
      }
    } catch (error) {
      message.error("Không thể thêm bình luận");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await likeComment(documentId, commentId);
      if (response.code === 200) {
        await fetchComments();
      }
    } catch (error) {
      message.error("Không thể thích bình luận");
    }
  };

  return (
    <>
      <Tooltip title="Bình luận">
        <Button
          type="text"
          icon={<CommentOutlined />}
          onClick={showModal}
          className={cx("comment-btn")}
        >
          Bình luận ({total})
        </Button>
      </Tooltip>

      <Modal
        title="Bình luận"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <div className={cx("comment-section")}>
          <div className={cx("comment-input")}>
            <Input.TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết bình luận..."
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmitComment}
              className={cx("submit-btn")}
            >
              Gửi
            </Button>
          </div>

          <List
            loading={loading}
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item
                actions={[
                  <Tooltip title="Thích">
                    <Button
                      icon={<LikeOutlined />}
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      {comment.likesCount || 0}
                    </Button>
                  </Tooltip>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={comment.user?.avatar} />}
                  title={
                    <div className={cx("comment-header")}>
                      <span className={cx("username")}>{comment.username}</span>
                      <span className={cx("date")}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  }
                  description={
                    <div className={cx("des")}>{comment.content}</div>
                  }
                />
              </List.Item>
            )}
          />

          {comments.length > 0 && comments.length < total && (
            <div className={cx("load-more")}>
              <Button onClick={handleLoadMore} loading={loading}>
                Xem thêm
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Comment;
