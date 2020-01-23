(function() {
    Vue.component("image-component", {
        template: "#modal",
        props: ["id"],
        data: function() {
            return { image: null, comment: "", username: null, comments: [] };
        },
        mounted: function() {
            console.log("component mounted: ");
            console.log("id: ", this.id);
            var vueInstance = this;
            axios
                .get("/selected/" + this.id)
                .then(function(results) {
                    console.log("results.data : ", results.data);
                    vueInstance.image = results.data[0];
                    console.log("vueInstance.images: ", vueInstance.image);
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });

            axios
                .get("/comment/" + this.id)
                .then(function(results) {
                    console.log("comment results data: ", results.data);
                    vueInstance.comments = results.data;
                    console.log("vueInstance.comment :", vueInstance.comment);
                    // for (var i in results.data) {
                    //     vueInstance.comments.push(results.data[i]);
                    // }
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        },

        watch: {
            id: function() {
                // in here we want to do excatly the same as we did in mounted. We can copy the axios request
                // but the ideal is not to repeat code
                // another problem we need to deal with is if the user tries to go to an image that doesn't exist
                // look ath the response from the server, and based on it if the response is a certain thing... close the module
            }
        },

        methods: {
            closeModal: function() {
                this.$emit("close");
            },

            handleComments: function(e) {
                e.preventDefault();
                console.log("button clicked");
                console.log("this:", this);
                console.log("username", this.username);
                console.log("comment:", this.comment);
                console.log("id: ", this.id);

                var vueInstance = this;

                axios
                    .post("/comment", {
                        username: this.username,
                        comment: this.comment,
                        id: this.id
                    })
                    .then(function(resp) {
                        console.log("resp from post/comment: ", resp);
                        vueInstance.comments.unshift(resp.data[0]);
                    })
                    .catch(err => {
                        console.log("err in resp/upload: ", err);
                    });
            }
        }
    });

    new Vue({
        el: "#main",
        data: {
            selectedImage: location.hash.slice(1),
            heading: "IMAGE BOARD",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            classMainContainer: "main-container",
            classContainer: "container",
            classPicture: "picture",
            classTitle: "title",
            lastId: null
        },
        created: function() {
            console.log("created");
        },
        mounted: function() {
            console.log("mounted");
            var vueInstance = this;
            addEventListener("hashchange", function() {
                console.log("hash change happened");
                vueInstance.imageId = location.hash.slice(1);
            });

            axios
                .get("/images")
                .then(function(results) {
                    console.log("results.data: ", results.data);
                    var latestPic = results.data.length - 1;
                    var latestPicId = results.data[latestPic].id;
                    console.log("id of last pic:", latestPicId);
                    vueInstance.images = results.data;
                    vueInstance.lastId = latestPicId;
                })
                .catch(function(err) {
                    console.log("err: ", err);
                });
        },

        methods: {
            closeMe: function() {
                this.selectedImage = null;
                // location.hash + "";
                history.replaceState(null, null, " ");
            },

            handleClick: function(e) {
                e.preventDefault();
                console.log("this: ,", this);
                // this lets us see what was typed in the input field
                // we need to use formData to send a file to the server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                // if I try to console.log formData, i'll get an empty objet

                var vueInstance = this;

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from post/upload: ", resp);
                        vueInstance.images.unshift(resp.data[0]);
                    })
                    .catch(err => {
                        console.log("err in resp/upload: ", err);
                    });
            },

            loadMore: function(e) {
                e.preventDefault();
                var vueInstance = this;
                console.log("more button clicked");
                console.log("vueInstance", vueInstance);
                console.log("vueInstance.lastId: ", vueInstance.lastId);
                // var latestPic = results.data.length - 1;
                // var latestPicId = results.data[latestPic].id;
                // console.log("id of last pic:", latestPicId);
                axios
                    .get("/more/" + this.lastId)
                    .then(function(results) {
                        console.log(
                            "results.data from getMoreImages: ",
                            results.data
                        );
                        for (var i in results.data) {
                            vueInstance.images.push(results.data[i]);
                        }
                    })
                    .catch(function(err) {
                        console.log("err: ", err);
                    });
            },

            handleChange: function(e) {
                console.log("haddleChange is running");
                console.log("file", e.target.files[0]);
                this.file = e.target.files[0];
            }
        }
    });
})();

//
