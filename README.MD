[git submoules](https://www.atlassian.com/git/tutorials/git-submodule)


## Remove submodules


```git submodule deinit <path_to_submodule>```

```git rm <path_to_submodule>```

```git commit-m "Removed submodule "```

```rm -rf .git/modules/<path_to_submodule>```


# Clone this project with its submodule

To clone a repository containing submodules:

```$ git clone --recursive <URL to Git repo>```


If you have already cloned a repository and want to load its submodules:


```$ git submodule update --init```


If there are nested submodules:


```$ git submodule update --init --recursive```