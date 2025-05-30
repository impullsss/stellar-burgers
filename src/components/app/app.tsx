import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';

import {
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute,
  Root
} from '@components';
import { useEffect } from 'react';
import { useDispatch } from '@store';
import { fetchUser, fetchIngredients, resetOrderModalData } from '@slices';
import styles from '../root/root.module.css';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location };

  const feedMatch = useMatch('/feed/:number')?.params.number;
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const currentNumber = feedMatch || profileMatch;

  const handleModalClose = () => {
    navigate(-1);
    dispatch(resetOrderModalData());
  };

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <Root>
      <>
        <Routes location={state?.background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/feed/:number'
            element={
              <div className={styles.detailPageWrap}>
                <h1
                  className={`${styles.detailHeader} text text_type_main-large`}
                >
                  {currentNumber ? `#${currentNumber.padStart(6, '0')}` : ''}
                </h1>
                <OrderInfo />
              </div>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <div>
                <h1
                  className={`${styles.detailHeader} text text_type_main-large`}
                >
                  Детали ингредиента
                </h1>
                <IngredientDetails />
              </div>
            }
          />
          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <div className={styles.detailPageWrap}>
                  <h1
                    className={`${styles.detailHeader} text text_type_main-large`}
                  >
                    {currentNumber ? `#${currentNumber.padStart(6, '0')}` : ''}
                  </h1>
                  <OrderInfo />
                </div>
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
        {state?.background && (
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={handleModalClose}>
                  <IngredientDetails />
                </Modal>
              }
            />
          </Routes>
        )}
        {state?.background && (
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal
                  title={
                    currentNumber ? `#${currentNumber.padStart(6, '0')}` : ''
                  }
                  onClose={handleModalClose}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}
        {state?.background && (
          <Routes>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  title={
                    currentNumber ? `#${currentNumber.padStart(6, '0')}` : ''
                  }
                  onClose={handleModalClose}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        )}
      </>
    </Root>
  );
};

export default App;
