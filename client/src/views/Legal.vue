<template>
    <div>
        <v-toolbar flat dark color="#0063ff">
            <v-toolbar-title class="mx-0">ME-ASSISTANT</v-toolbar-title>
            <p>v1.0</p>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat round router to="/">Accueil</v-btn>
                <v-btn flat round router to="/signup">Connexion</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <section>
                <v-container>
                    <v-layout column>
                        <h1>MENTIONS LÉGALES</h1>
                        <p>En vigueur au 16/04/2019</p>
                        <p>Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la
                            Confiance
                            dans l’économie numérique, dite L.C.E.N., il est porté à la connaissance des Utilisateurs du site
                            http://projet6.codeassist.io les présentes mentions légales.
                            La connexion et la navigation sur le site (indiquer le nom du site) par l’Utilisateur implique
                            acceptation intégrale et
                            sans réserve des présentes mentions légales.
                            Ces dernières sont accessibles sur le site à la rubrique « Mentions légales ».</p>
                        <h2>ARTICLE 1 : L’ÉDITEUR</h2>
                        <p>L’édition et la direction de la publication du site http://projet6.codeassist.io est assurée par Martin
                            Julien, domiciliée
                            18 rue du petit clos saint-marc, dont le numéro de téléphone est 0676132431, et l'adresse e-mail
                            martinjulien@outlook.fr.</p>
                        <h2>ARTICLE 2 : L’HÉBERGEUR</h2>
                        <p>L'hébergeur du site http://projet6.codeassist.io est la Société OVH, dont le siège social est situé au 2
                            rue
                            Kellermann - 59100 Roubaix - France , avec le numéro de téléphone : 1007.</p>
                        <h2>ARTICLE 3 : ACCÈS AU SITE</h2>
                        <p>Le site est accessible par tout endroit, 7j/7, 24h/24 sauf cas de force majeure, interruption programmée
                            ou non et
                            pouvant découlant d’une nécessité de maintenance.
                            En cas de modification, interruption ou suspension des services le site http://projet6.codeassist.io ne
                            saurait être
                            tenu responsable.</p>
                        <h2>ARTICLE 4 : COLLECTE DES DONNÉES</h2>
                        <p>Le site est exempté de déclaration à la Commission Nationale Informatique et Libertés (CNIL) dans la
                            mesure où il
                            ne collecte aucune donnée concernant les utilisateurs.</p>
                        <h2>ARTICLE 5 : COOKIES</h2>
                        <p>L’Utilisateur est informé que lors de ses visites sur le site, un cookie peut s’installer automatiquement
                            sur son
                            logiciel de navigation.
                            En naviguant sur le site, il les accepte.
                            Un cookie est un élément qui ne permet pas d’identifier l’Utilisateur mais sert à enregistrer des
                            informations
                            relatives à la navigation de celui-ci sur le site Internet. L’Utilisateur pourra désactiver ce cookie
                            par l’intermédiaire
                            des paramètres figurant au sein de son logiciel de navigation.</p>
                        <h2>ARTICLE 6 : PROPRIÉTÉ INTELLECTUELLE</h2>
                        <p>Toute utilisation, reproduction, diffusion, commercialisation, modification de toute ou partie du site
                            http://projet6.codeassist.io, sans autorisation de l’Editeur est prohibée et pourra entraînée des
                            actions et poursuites
                            judiciaires telles que notamment prévues par le Code de la propriété intellectuelle et le Code
                            civil.</p>
                    </v-layout>
                </v-container>
            </section>
        </v-content>
    </div>
</template>

<script>
    export default {
        name: "Legal"
    }
</script>

<style scoped>

</style>