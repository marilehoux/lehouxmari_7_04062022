<template>
<div class="bg-light">
    <ul class="list-group">
        <li  class="list-group-item m-2">
          <div v-if=!edit>
            <div class="d-flex justify-content-between align-items-center mx-2">
            <div class="lead text-primary">{{post.userId.email || user.email}}</div>
            <!-- <div class="lead text-primary">{{user.email}}{{user.level}}</div> -->
            <button @click.prevent="likePost()" class="btn" :class="likeClass" ><i class="bi bi-star-fill me-2"></i><span class="badge bg-primary">{{post.likes}}</span></button>
            </div>          

            <div class="my-2 card-body bg-light rounded text-secondary fs-4"> {{post.content}}</div>
            <div v-if="post.imageUrl"><img :src="post.imageUrl" class="img-fluid" alt="image du post"></div>
             <div v-if="user.userId == post.userId._id || user.level == 1 || post.userId == user.userId" class=" btn-group my-2 gap-2 d-flex justify-content-between">
                <button @click.prevent="edit = true"  class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil me-2"></i>Modifier</button>
                <button @click.prevent="deletePost()" class="btn btn-sm btn-outline-danger"><i class="bi bi-trash me-2"></i>Supprimer</button>
            </div> 
          </div>
          <div class="bg-light" v-else>
            <PostSend :edit='edit' :user='user' :postModif='post' @post-modified="modifyPost" @cancel="edit = false" />
          </div>

        </li>
    </ul>

</div>
</template>
<script>
import PostSend from './PostSend.vue'
import axios from 'axios';

export default {
  name: 'Post-Item',

  data() {
    return {
        edit: false
    }
  },

  components: {
    PostSend
  },

  props: {
    post: Object,
    user: Object
  },

  computed: {
    likeClass() {
        if (this.post.usersLiked.includes(this.user.userId)) return 'btn-primary';
        else return 'btn-outline-primary'
    }
  },

  methods: {

    modifyPost(post) {
        this.$emit('post-modified', post);
        this.edit = false;
    },

    deletePost() {
        let confirm = window.confirm('Souhaitez-vous supprimer ce post ?');

        if (confirm) {
            axios.delete('http://localhost:3000/api/post/'+this.post._id, {
                headers: {
                    'Authorization': 'Bearer '+this.user.token
                }
            })
            .then(()=>{
                this.$emit('post-deleted', this.post);
            })
            .catch((error)=>{
                alert(error);
                console.error(error);
            });
        }
    },

    likePost() {
        axios.post('http://localhost:3000/api/post/'+this.post._id+'/like', {},{
            headers: {
                'Authorization': 'Bearer '+this.user.token
            }
        })
        .then((resp) => {
            
            this.$emit('post-liked', resp.data.post);
        })
        .catch((error) => {
            alert(error);
            console.error(error);
        })
    }
  }

} 
  </script>