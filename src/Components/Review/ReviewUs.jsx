import React, { useState, useEffect } from "react"
import { useAuth } from "../../AuthContext"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import "./review.css"
import { db } from "../../firebase"
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { Form, Input, Button, notification, Modal as AntModal } from 'antd'


const ReviewUs = () => {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const { name, experience, image, review, email } = reviews[currentIndex] || {}
    const [isVisible, setIsVisible] = useState(false)
    const [isVisible2, setIsVisible2] = useState(false)
    const [userName, setUserName] = useState("")
    const [imgUrl, setImgUrl] = useState("")
    const [Email, setEmail] = useState("");
    const [formData, setFormData] = useState({
        name: userName,
        experience: "",
        review: "",
        image: imgUrl,
        email: Email
    })
    const [editing, setEditing] = useState(false)
    const [editFormData, setEditFormData] = useState({
        experience: "",
        review: "",
    })
    const [hasUserReviewed, setHasUserReviewed] = useState(false)
    const [modalVisible1, setModalVisible1] = useState(false);
    const [IdReviewDelete, setIdReviewDelete] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [cacheLoaded, setCacheLoaded] = useState(false);




    const openNotificationWithIcon = (type, message, description, placement) => {
        notification[type]({
            message,
            description,
            placement,
        });
    };

    const handleSubmit = async (values) => {

        if (isOffline) {
            openNotificationWithIcon('error', 'No Internet Connection', 'You cannot submit a review while offline.', 'top');
            return;
        }

        if (values.experience.trim() === "" || values.review.trim() === "") {
            openNotificationWithIcon('warning', 'Warning', 'All fields are required', 'top');
            return;
        }

        try {
            const reviewData = {
                name: userName,
                experience: values.experience,
                review: values.review,
                image: imgUrl,
                email: Email,
            };
            const reviewsCollectionRef = collection(db, 'reviews');
            const docRef = await addDoc(reviewsCollectionRef, reviewData);

            setReviews(prevReviews => [...prevReviews, { ...reviewData, id: docRef.id }]);
            openNotificationWithIcon('success', 'Success', 'Review uploaded successfully', 'topRight');
            setFormData({
                ...formData,
                experience: "",
                review: "",
            });
            setIsVisible(false);
            setHasUserReviewed(true);
        } catch (error) {
            console.log(error);
            openNotificationWithIcon('error', 'Error', 'Ops, An issue occurred while submitting the review. Please try again', 'top');
        }
    }

    const handleEditSubmit = async (values) => {

        if (isOffline) {
            openNotificationWithIcon('error', 'No Internet Connection', 'You cannot edit a review while offline.', 'top');
            return;
        }

        try {
            const currentReview = reviews[currentIndex];
            if (!currentReview) {
                throw new Error("Invalid review data or invalid currentIndex");
            }

            const reviewsCollectionRef = collection(db, 'reviews')
            const querySnapshot = await getDocs(query(reviewsCollectionRef,
                where("name", "==", currentReview.name),
                where("review", "==", currentReview.review),
                where("experience", "==", currentReview.experience),
                where("email", "==", currentReview.email)))

            let reviewDocId
            querySnapshot.forEach((doc) => {
                reviewDocId = doc.id
            })

            if (!reviewDocId) {
                openNotificationWithIcon('warning', 'Warning', 'Review not found', 'top');
                return
            }

            const reviewDocRef = doc(db, "reviews", reviewDocId)

            const updatedReviewData = {
                experience: editFormData.experience,
                review: editFormData.review
            }

            await updateDoc(reviewDocRef, values)

            setReviews(prevReviews => prevReviews.map(r =>
                r.email === currentReview.email ? { ...r, ...values } : r
            ));

            console.log(values)
            openNotificationWithIcon('success', 'Success', 'Review update successfully', 'topRight');

            setEditing(false);
            closeUpdateReview();
            setEditFormData({
                experience: "",
                review: "",
            });
        } catch (error) {
            console.log(error);
            openNotificationWithIcon('error', 'Error', 'Ops, An issue occurred while submitting the review. Please try again', 'top');
        }
    }

    const nextPerson = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }

    const prevPerson = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length)
    }

    const getRandomPerson = () => {
        const randomIndex = Math.floor(Math.random() * reviews.length)
        setCurrentIndex(randomIndex)
    }

    const getCurrentReview = () => {
        if (user) {
            const userReviewIndex = reviews.findIndex(review => review.email === user.email)
            if (userReviewIndex !== -1) {
                setCurrentIndex(userReviewIndex)
            } else {
                openNotificationWithIcon('error', 'Error', 'You haven t submitted a review yet', 'top');
            }
        }
    }

    const showReview = () => {
        setIsVisible(true)
        setIsVisible2(false)
    }

    const showEditReview = () => {
        setIsVisible2(true)
        setIsVisible(false)
    }

    const closeReview = () => {
        setIsVisible(false)
        setIsVisible2(false)
    }

    const closeUpdateReview = () => {
        setIsVisible2(false)
        setIsVisible(false)
    }

    const handleEditClick = () => {
        const currentReview = reviews[currentIndex];
        setEditFormData({
            experience: currentReview.experience,
            review: currentReview.review,
        });
        setEditing(true);
        showEditReview();
    }

    const handleDelete = (userEmail) => {
        setModalVisible1(true)
        setIdReviewDelete(userEmail)
    }

    const handleDeleteConfirm = async () => {
        try {
            if (user.email) {
                const reviewsCollectionRef = collection(db, 'reviews');
                const q = query(reviewsCollectionRef, where('email', '==', user.email));
                const querySnapshot = await getDocs(q);

                let foundReviews = false;
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                    foundReviews = true;
                });

                setReviews(prevReviews => {
                    const updatedReviews = prevReviews.filter(review => review.email !== user.email);

                    if (updatedReviews.length === 0) {
                        setCurrentIndex(0);
                        return updatedReviews;
                    }

                    let newIndex;
                    if (currentIndex >= updatedReviews.length) {
                        newIndex = Math.floor(Math.random() * updatedReviews.length);
                    } else {
                        newIndex = currentIndex;
                    }

                    setCurrentIndex(newIndex);
                    return updatedReviews;
                });
            }

            setHasUserReviewed(false);
            openNotificationWithIcon('success', 'Removal Completed', 'The review has been successfully deleted', 'topRight');

        } catch (error) {
            openNotificationWithIcon('error', 'Error Deleting', 'There was an issue deleting the review. Please try again', 'top');
        }
        setModalVisible1(false);
    }

    //CACHE

    const fetchAndCacheReviews = async () => {
        try {
            const reviewsCollectionRef = collection(db, 'reviews');
            const querySnapshot = await getDocs(reviewsCollectionRef);
            const reviewsData = [];
            querySnapshot.forEach((doc) => {
                reviewsData.push(doc.data());
            });
            setReviews(reviewsData);
            if ('caches' in window) {
                const cache = await caches.open('cache');
                cache.put('/review', new Response(JSON.stringify(reviewsData)));
            }
        } catch (error) {
            console.error("Errore nel caricamento delle recensioni: ", error);
        }
    }

    const handleConnectionChange = () => {
        const condition = navigator.onLine ? 'online' : 'offline';
        setIsOffline(condition === 'offline');
        if (condition === 'offline') {
            loadReviewsFromCache();
        } else {
            fetchAndCacheReviews();
        }
    }

    const loadReviewsFromCache = async () => {
        const cache = await caches.open('cache');
        const cachedResponse = await cache.match('/review');
        if (cachedResponse) {
            const reviews = await cachedResponse.json();
            setReviews(reviews);
            setCacheLoaded(true);
        } else {
            setCacheLoaded(false);
        }
    }

    useEffect(() => {
        window.addEventListener("online", handleConnectionChange);
        window.addEventListener("offline", handleConnectionChange);

        if (navigator.onLine) {
            fetchAndCacheReviews();
        } else {
            loadReviewsFromCache();
        }

        return () => {
            window.removeEventListener("online", handleConnectionChange);
            window.removeEventListener("offline", handleConnectionChange);
        };
    }, []);




    useEffect(() => {
        const checkUserReview = async () => {
            if (user) {
                const reviewsCollectionRef = collection(db, 'reviews')
                const querySnapshot = await getDocs(query(reviewsCollectionRef, where('email', '==', user.email)))
                const hasReview = !querySnapshot.empty
                setHasUserReviewed(hasReview)
            }
        };
        checkUserReview()
    }, [user])

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const usersCollectionRef = collection(db, 'users')
                const q = query(usersCollectionRef, where('email', '==', user.email))
                const querySnapshot = await getDocs(q)

                querySnapshot.forEach((doc) => {
                    const userData = doc.data()
                    setUserName(userData.name)
                    setImgUrl(userData.imgUrl)
                    setEmail(userData.email)
                })
            }
        }
        fetchUserData();
    }, [user])

    useEffect(() => {
        if (userName !== "") {
            setFormData(prevState => ({
                ...prevState,
                name: userName,
            }));
        }
    }, [userName])

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewsCollectionRef = collection(db, 'reviews')
            const querySnapshot = await getDocs(reviewsCollectionRef)
            const reviewsData = []
            querySnapshot.forEach((doc) => {
                const review = doc.data()
                reviewsData.push(review)
            })
            setReviews(reviewsData)
        }
        fetchReviews()
    }, [])

    useEffect(() => {
        if (reviews[currentIndex]) {
            const currentReview = reviews[currentIndex];
            setEditFormData({
                experience: currentReview.experience || "",
                review: currentReview.review || "",
            });
        }
    }, [currentIndex, reviews])




    return (
        <main>
            {isOffline && !cacheLoaded && (
                <div className="no-internet-overlay">
                    <h1>Connect To The Internet</h1>
                </div>
            )}
            {user ? (
                !hasUserReviewed ? (
                    <div className="buttons-container">
                        <Button onClick={showReview} disabled={isOffline}>Leave your review</Button>
                    </div>
                ) : null
            ) : (
                <div className="buttons-container">
                    <p>You need to log in to leave a review.</p>
                    {isVisible && setIsVisible(false)}
                </div>
            )}

            <section className={`container ${isOffline ? 'offline-mode' : ''}`}>
                {isVisible && (
                    <Form
                        className='form-containerSu'
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <h2 className="heading">Leave your review</h2>
                        <Form.Item
                            label="Experience"
                            name="experience"
                            rules={[{ required: true, message: 'Please enter your experience!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Review"
                            name="review"
                            rules={[{ required: true, message: 'Please enter your review!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <div className="form-button-group">
                            <Button type="primary" htmlType="submit">
                                Submit Review
                            </Button>
                            <Button onClick={closeReview}>
                                Close
                            </Button>
                        </div>
                    </Form>
                )}

                {isVisible2 && (
                    <Form
                        className="form-containerSu"
                        layout="vertical"
                        onFinish={handleEditSubmit}
                    >
                        <div className="heading">
                            <h4>Hi, {userName}</h4>
                            <h2>Update your review</h2>
                        </div>

                        <Form.Item
                            label="Experience"
                            name="experience"
                            rules={[{ required: true, message: 'Please enter your experience!' }]}
                        >
                            <Input defaultValue={editFormData.experience} />
                        </Form.Item>
                        <Form.Item
                            label="Review"
                            name="review"
                            rules={[{ required: true, message: 'Please enter your review!' }]}
                        >
                            <Input.TextArea defaultValue={editFormData.review} />
                        </Form.Item>
                        <div className="form-button-group">
                            <Button type="primary" htmlType="submit" disabled={isOffline}>
                                Update Review
                            </Button>
                            <Button onClick={closeReview}>
                                Close
                            </Button>
                        </div>
                    </Form>

                )}

                <div className={"form-containerRe"}>
                    <article className="review">
                        <div className="title">
                            <h2>Our Reviews</h2>
                            <div className="underline"></div>
                            {user && user.email && reviews[currentIndex] && reviews[currentIndex].email && user.email.trim() === reviews[currentIndex].email.trim() ? (
                                <div>
                                    <br></br>
                                    <Button onClick={handleEditClick} disabled={isOffline}>
                                        Update your Review
                                    </Button>
                                    <Button onClick={() => handleDelete(user.email)} disabled={isOffline}>Delete Review</Button>
                                </div>

                            ) : (null)}

                        </div>


                        <div className="img-container">
                            <img src={image} alt={name} className="person-img" />
                        </div>
                        <h4 className="author">{name}</h4>
                        <p className="experience">{experience}</p>
                        <p className="info">{review}</p>
                        <div className="button-container">
                            <Button className="prev-btn" onClick={prevPerson}>
                                <FaChevronLeft />
                            </Button>
                            <Button className="next-btn" onClick={nextPerson}>
                                <FaChevronRight />
                            </Button>
                        </div>
                        <Button className="random-btn" onClick={getRandomPerson}>Get Random Review</Button>
                        <br />
                        {user ? (
                            <Button className="random-btn" onClick={getCurrentReview}>My review</Button>
                        ) : (null)}

                    </article>
                </div>

                <AntModal
                    title="Confirm Deletion"
                    visible={modalVisible1}
                    onCancel={() => setModalVisible1(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setModalVisible1(false)}>Cancel</Button>,
                        <Button key="confirm" type="primary" onClick={handleDeleteConfirm}>Confirm</Button>,
                    ]}
                >
                    Are you sure you want to delete this review?
                </AntModal>



            </section>
        </main >
    );
};

export default ReviewUs;
