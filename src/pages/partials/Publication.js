import React, { useRef, useState, useContext, useEffect, useCallback } from 'react';
import authenticationContext from '../../context/authenticationContext';
import useHttp from '../../hooks/useHttp';
import '../../css/publication.css';

function Publication({ publication }) {
    const { _id: id, text, authorId, comments, date } = publication
    const { logout, checkAuthentication } = useContext(authenticationContext);
    const { loading, request } = useHttp();

    const [author, setAuthor] = useState(null);
    const [editable, setEditable] = useState(false);
    const [editTextError, setEditTextError] = useState([]);
    const [newText, setNewText] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [plusComment, setPlusComment] = useState(false);  // поле для нового комента
    const [commentErr, setCommentErr] = useState([]);
    const [actualComments, setActualComments] = useState([...comments])
    // console.log(actualComments.reverse())
    const editableValue = useRef();
    const commentValue = useRef();

    const getAuthor = useCallback(async () => {
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        const { userId, token } = JSON.parse(localStorage.getItem('authData'));
        try {
            const { user: author } = await request(`/api/user/${userId}/${authorId}`, 'GET', null, { Authorization: `Bearer ${token}` });
            if (author) {
                setAuthor(author);
            }
        }
        catch (e) { }
    }, [checkAuthentication, logout, request, authorId])

    useEffect(() => { getAuthor() }, [getAuthor])


    function checkOwner() {
        if (checkAuthentication()) {
            const { userId } = JSON.parse(localStorage.getItem('authData'));
            if (userId === authorId) return true
        }
        return false;
    }

    async function deletePublication() {
        const { userId, token } = JSON.parse(localStorage.getItem('authData'));
        try {

            const result = await request(`/api/publication/delete/${id}`, "DELETE", { userId }, { Authorization: `Bearer ${token}` });
            if (result.isOk) {
                setAuthor(null);
            }
        } catch (e) { console.log(e) }

    }

    function editPublicate() {
        editable ? setEditable(false) : setEditable(true);
    }
    async function confirmEditable() {
        const value = editableValue.current.value;
        if (value === text) {
            setEditable(false);
            return false
        }
        if (value.trim().length < 10) {
            setEditable(false);
            setEditTextError(['Публікація - не менше 10 символів']);
            return false;
        }
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        if (!checkOwner()) {
            logout();
            window.location.replace('/');
            return false
        }

        const { userId, token } = JSON.parse(localStorage.getItem('authData'));

        const result = await request(`/api/publication/edit/`, "PATCH", { userId, value, id }, { Authorization: `Bearer ${token}` });

        if (result && result.isOk) {
            setNewText(value);
            setEditable(false);
            return false;
        }

    }

    function newComment() { // відобразити поле для нового комента
        plusComment ? setPlusComment(false) : setPlusComment(true);
    }

    async function confirmComment() {
        const value = commentValue.current.value;
        if (value.trim().length < 10) {
            setCommentErr(['Коментар - не менше 10 символів']);
            setPlusComment(false);
            return false;
        }
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        if (checkOwner()) {
            logout();
            window.location.replace('/');
            return false
        }

        const { userId, token } = JSON.parse(localStorage.getItem('authData'));

        const result = await request(`/api/publication/add_comment/`, "PATCH", { userId, value, publicationId: id, authorId: userId }, { Authorization: `Bearer ${token}` });

        if (result && result.isOk) {
            newComment();
            setActualComments(result.comments)
            viewComments(true) // true - мусять бути показані
            return false;
        }
        if (result.noPub) {
            setAuthor(false);
        }
    }
    function viewComments(onlyShow) {
        if (!onlyShow) {

            showComments ? setShowComments(false) : setShowComments(true);
            return false
        }
        if (!showComments) {
            setShowComments(true);
        }

    }

    function checkOwnerComment(authorId) {
        const { userId } = JSON.parse(localStorage.getItem('authData'));
        console.log()
        if (authorId === userId) { return true };
        return false;
    }

    async function deleteComment(commentId, authorId) {
        if (!checkAuthentication()) {

            logout();
            window.location.replace('/');
            return false;
        }

        if (!checkOwnerComment(authorId)) {
            console.log('owner lallala')
            logout();
            window.location.replace('/');
            return false;
        }

        const { userId, token } = JSON.parse(localStorage.getItem('authData'));

        const result = await request('/api/publication/delete_comment', "DELETE", { userId, publicationId: id, commentId }, { Authorization: `Bearer ${token}` });
        if (result.noPub) {
            setAuthor(false);
        }
        if (result) {
            setActualComments([...result.comments]);
            result.comments.length ? setShowComments(true) : setShowComments(false);
        }

    }
    return (
        <>
            {editTextError.length ?
                <div className="errors-block">
                    {editTextError.map((err, idx) => <div onClick={() => { setEditTextError([]) }} key={idx.toString()}><span>{err}</span></div>)}
                </div> :
                null}
            {commentErr.length ?
                <div className="errors-block">
                    {commentErr.map((err, idx) => <div onClick={() => { setCommentErr([]) }} key={idx.toString()}><span>{err}</span></div>)}
                </div> :
                null}
            {author ?
                <div className="wrap-publication">
                    <div className="publication-card bg-light">
                        <div className='wrap-content-block'>
                            <p className="author">{`${author.name} ${author.surname}`}</p>
                            {
                                editable ? <textarea onKeyPress={event => { if (event.key === 'Enter') confirmEditable() }} ref={editableValue} autoFocus className="content" defaultValue={newText ? newText : text}></textarea> : <p className="content">{newText ? newText : text}</p>
                            }
                            <p className="date">{date}</p>
                            {showComments ?
                                <div className="wrapper-comments">
                                    <div className="wrap-comments-list">
                                        {actualComments.map((comment, idx) => {
                                            return (
                                                <div key={comment._id} className="comment">
                                                    <p className="comment-author">{comment.authorName}</p>
                                                    <p className="comment-content">{comment.text}</p>
                                                    <p className="comment-date">{comment.date}</p>
                                                    {/* comment-action*/}
                                                    {checkOwnerComment(comment.authorId) ?
                                                        <div className="coments-action">
                                                            <div className="delete-comment"><button disabled={loading} onClick={() => { deleteComment(comment._id, comment.authorId) }} className='comment-btn-reset'><img className='comment-action-img' title='Видалити ваш коментар' src="/icons/delete-publication.png" alt="delete-publicatation" /></button></div>
                                                        </div> : null}


                                                </div>)
                                        }).reverse()}
                                    </div>
                                </div> : null}
                        </div>
                    </div>
                    <div className="publication-action">  {/* publication-action*/}
                        {
                            checkOwner() ?
                                <div className="manage-block">  {/* manage block*/}
                                    {
                                        editable
                                            ?
                                            <>
                                                <div className="edit"><button disabled={loading} onClick={confirmEditable} className='publication-btn-reset'><img className='manage-img' title='Підтвердити редагування' src="/icons/check-circle.png" alt="edit_publication" /></button></div>
                                                <div className="edit"><button disabled={loading} onClick={editPublicate} className='publication-btn-reset'><img className='manage-img' title='Відмінити редагування публікації' src="/icons/edit_publication.png" alt="edit_publication" /></button></div>
                                            </>
                                            :
                                            <div className="edit"><button disabled={loading} onClick={editPublicate} className='publication-btn-reset'><img className='manage-img' title='Редагувати публікацію' src="/icons/edit_publication.png" alt="edit_publication" /></button></div>
                                    }

                                    <div className="delete"><button disabled={loading} onClick={deletePublication} className='publication-btn-reset'><img className='manage-img' title='Видалити публікацію' src="/icons/delete-publication.png" alt="delete-publicatation" /></button></div>
                                </div>
                                :
                                null
                        }

                        <div className="comunicate-block"> {/* comunicate block*/}
                            {!checkOwner() ?
                                plusComment ?
                                    <>
                                        <div onClick={confirmComment} className="add-commnent"><button disabled={loading} className='publication-btn-reset'><img className='comunicate-img' title='Підтвердити коментар' src="/icons/check-circle.png" alt="confirm-comment" /></button></div>
                                        <div onClick={newComment} className="add-commnent"><button className='publication-btn-reset'><img className='comunicate-img' title='Відмінити добавлення коментаря' src="/icons/publication_plus_comment.png" alt="add-comment" /></button></div>
                                    </>
                                    : <div onClick={newComment} className="add-commnent"><button disabled={loading} className='publication-btn-reset'><img className='comunicate-img' title='Добавити коментар' src="/icons/publication_plus_comment.png" alt="add-comment" /></button></div> : null
                            }
                            {
                                actualComments.length ?


                                    showComments ? <div className="add-commnent"><button disabled={loading} onClick={() => { viewComments() }} className='publication-btn-reset'><img className='comunicate-img'
                                        title='Приховати коментарі' src="/icons/publication_show_comments.png" alt="add-comment" /></button></div> :
                                        <div className="add-commnent"><button disabled={loading} onClick={() => { viewComments() }} className='publication-btn-reset'><img className='comunicate-img'
                                            title='Показати коментарі' src="/icons/publication_show_comments.png" alt="add-comment" /></button></div>


                                    :
                                    null
                            }

                        </div>
                    </div>
                    {plusComment ?
                        <div className="wrap-add-comment">
                            <textarea onKeyPress={event => { if (event.key === 'Enter') confirmComment() }} ref={commentValue} resize='none' autoFocus></textarea>
                        </div> :
                        null}
                </div>



                :
                null
            }

        </>
    )
}
export default Publication;