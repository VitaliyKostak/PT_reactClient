import React, { useRef, useState, useContext, useEffect } from 'react';
import authenticationContext from '../context/authenticationContext';
import Publication from './partials/Publication';
import useHttp from '../hooks/useHttp';
import Sidebar from './partials/Sidebar';
import '../css/my_publication.css';
function MyPublication() {

    const textNewPublication = useRef();
    const { logout, checkAuthentication } = useContext(authenticationContext);
    const { loading, errors, clearErrors, request } = useHttp();
    const [textAreaErr, setTextAreaErr] = useState([]);
    const [newPublicate, setNewPublicate] = useState(false);
    const [publications, setPublications] = useState([]);


    const getPublications = async () => {
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        const { userId, token } = JSON.parse(localStorage.getItem('authData'));
        try {

            const { publications } = await request(`/api/publication/by_user/${userId}`, 'GET', null, { Authorization: `Bearer ${token}` });
            setPublications(publications)
        } catch (e) { }
    }
    useEffect(() => { return getPublications() }, [newPublicate]);

    function clearTextAreaErr() {
        if (textAreaErr.length) setTextAreaErr([]);
    }

    async function addPublication() {
        if (!checkAuthentication()) {
            logout();
            window.location.replace('/');
            return false;
        }
        const valuePublication = textNewPublication.current.value;
        if (valuePublication.trim().length < 10) {
            setTextAreaErr(['Публікація - не менше 10 символів']);
            return false;
        }

        try {
            clearTextAreaErr();
            const { userId, token } = JSON.parse(localStorage.getItem('authData'));

            const result = await request('/api/publication/add_publication', 'POST', { userId, textPublication: valuePublication, }, { Authorization: `Bearer ${token}` });
            if (!result) {
                return false;
            }
            setNewPublicate(true);
            setTimeout(() => {
                setNewPublicate(false);
            }, 2000);
            textNewPublication.current.value = '';



        } catch (e) {
        }



    }

    return (
        <div className='my-publication-page min-height500'>
            <Sidebar activePage='MyPublication' />
            <main>
                {newPublicate
                    ?
                    <div className="publicate-succes">
                        <p>Публікація добавлена</p>
                    </div> :
                    null
                }

                {textAreaErr.length
                    ?
                    <div className="errors-block">
                        {textAreaErr.map((err, idx) => <div onClick={clearTextAreaErr} key={idx.toString()}><span>{err}</span></div>)}
                    </div>
                    :
                    null
                }
                {errors
                    ?
                    <div className="errors-block">
                        {textAreaErr.map((err, idx) => <div key={idx.toString()}><span>{err}</span></div>)}
                    </div>
                    :
                    null
                }
                <div className="wrapper">
                    <div className="wrap-title">
                        <h1>Мої публікації</h1>
                        <div className="add-publication">
                            <button disabled={loading} className='publication-btn-reset' onClick={addPublication} >
                                <img className='manage-img' title='Добавити публікацію' src="/icons/plus.png" alt="edit_publication" />
                            </button>
                        </div>
                    </div>
                    <div className="wrap-publications">
                        <div className="wrap-textarea-add-publication">
                            <textarea onKeyPress={event => { if (event.key === 'Enter') addPublication() }} disabled={loading} resize='none' className='textarea-add-publication bg-light' rows="4" placeholder='Ваш текст...' ref={textNewPublication}></textarea>
                        </div>
                        {
                            publications
                                ?
                                publications.map((publication) => <Publication publication={publication} key={publication._id.toString()} />
                                )
                                :
                                null
                        }


                    </div>
                </div>
            </main>
        </div>

    )

}

export default MyPublication;