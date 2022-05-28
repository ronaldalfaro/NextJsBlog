/* eslint-disable @next/next/no-img-element */
import styles from '../styles/AuthorTitle.module.css';

export default function AuthorTitle({ name, avatar }) {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={avatar} alt="author avatar" />
      <h3 className={styles.title}>{name}</h3>
    </div>
  );
}
